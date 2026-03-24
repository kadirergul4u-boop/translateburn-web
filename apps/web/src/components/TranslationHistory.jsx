
import React from 'react';
import { History, Trash2, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet.jsx';
import { ScrollArea } from '@/components/ui/scroll-area.jsx';
import { Separator } from '@/components/ui/separator.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { toast } from 'sonner';

export default function TranslationHistory({ history, onRestore, onClear, onRemove }) {
  const handleCopy = async (text, e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard');
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <History className="h-4 w-4" />
          <span className="hidden sm:inline">History</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <SheetTitle>Translation History</SheetTitle>
          {history.length > 0 && (
            <Button variant="ghost" size="sm" onClick={onClear} className="text-destructive hover:text-destructive/90 hover:bg-destructive/10">
              Clear All
            </Button>
          )}
        </SheetHeader>
        
        <ScrollArea className="flex-1 -mx-6 px-6">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-center space-y-3">
              <History className="h-8 w-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">No recent translations</p>
            </div>
          ) : (
            <div className="space-y-4 pb-6">
              <AnimatePresence initial={false}>
                {history.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="group relative rounded-xl border bg-card p-4 shadow-sm transition-all hover:shadow-md cursor-pointer"
                    onClick={() => onRestore(item)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs font-medium">{item.sourceLang}</Badge>
                        <span className="text-muted-foreground text-xs">→</span>
                        <Badge variant="secondary" className="text-xs font-medium">{item.targetLang}</Badge>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => handleCopy(item.translatedText, e)}>
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive/90" onClick={(e) => { e.stopPropagation(); onRemove(item.id); }}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground line-clamp-2">{item.sourceText}</p>
                      <Separator />
                      <p className="text-sm font-medium text-foreground line-clamp-3">{item.translatedText}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
