
import React from 'react';
import { BookOpen, Lightbulb, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton.jsx';
import { Badge } from '@/components/ui/badge.jsx';

export default function WordDefinitionCard({ word, language, isLoading, error, definitions }) {
  if (isLoading) {
    return (
      <div className="bg-card rounded-2xl p-6 shadow-sm border mt-6 w-full animate-in fade-in duration-300">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="space-y-4">
          <Skeleton className="h-5 w-24 mb-2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-card rounded-2xl p-6 shadow-sm border mt-6 w-full flex items-start gap-3 text-muted-foreground animate-in fade-in duration-300">
        <AlertCircle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
        <div>
          <h4 className="font-medium text-foreground mb-1">Dictionary unavailable</h4>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!definitions || definitions.length === 0) {
    return null;
  }

  return (
    <article className="bg-card rounded-2xl p-6 shadow-sm border mt-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-6 flex items-baseline gap-3">
        <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground capitalize">
          {word}
        </h3>
        {language && (
          <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
            {language}
          </span>
        )}
      </header>

      <div className="space-y-8">
        {definitions.map((meaning, idx) => (
          <section key={idx} className="space-y-4">
            <div className="flex items-center gap-2 border-b pb-2">
              <Badge variant="secondary" className="text-xs font-medium uppercase tracking-wider bg-secondary/50">
                {meaning.partOfSpeech}
              </Badge>
            </div>
            
            <ul className="space-y-5">
              {meaning.definitions.map((def, dIdx) => (
                <li key={dIdx} className="text-base text-foreground/90">
                  <div className="flex items-start gap-3">
                    <BookOpen className="h-5 w-5 mt-0.5 shrink-0 text-primary/60" aria-hidden="true" />
                    <span className="leading-relaxed">{def.definition}</span>
                  </div>
                  
                  {def.example && (
                    <div className="flex items-start gap-3 mt-2 ml-8 text-sm text-muted-foreground">
                      <Lightbulb className="h-4 w-4 mt-0.5 shrink-0 text-amber-500/70" aria-hidden="true" />
                      <span className="italic leading-relaxed">"{def.example}"</span>
                    </div>
                  )}
                </li>
              ))}
            </ul>

            {meaning.synonyms && meaning.synonyms.length > 0 && (
              <div className="flex items-start gap-3 mt-4 ml-8">
                <LinkIcon className="h-4 w-4 mt-1 shrink-0 text-primary/60" aria-hidden="true" />
                <div className="flex flex-wrap gap-2">
                  {meaning.synonyms.map((syn, sIdx) => (
                    <span 
                      key={sIdx} 
                      className="text-xs font-medium bg-muted text-muted-foreground px-2.5 py-1 rounded-md transition-colors hover:bg-muted/80 hover:text-foreground cursor-default"
                    >
                      {syn}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>
        ))}
      </div>
    </article>
  );
}
