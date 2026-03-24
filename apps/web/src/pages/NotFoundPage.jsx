
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Home, ArrowRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { motion } from 'framer-motion';

export default function NotFoundPage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <Helmet>
        <title>404 - Page Not Found | TranslateBurn</title>
        <meta name="description" content="The page you are looking for could not be found." />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md space-y-6"
      >
        <div className="space-y-2">
          <h1 className="text-7xl md:text-9xl font-extrabold text-primary/20 tracking-tighter">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Page Not Found
          </h2>
          <p className="text-muted-foreground text-balance">
            Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Button asChild size="lg" className="w-full sm:w-auto gap-2">
            <Link to="/">
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto gap-2">
            <Link to="/translate">
              Translation Tool
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </motion.div>
    </main>
  );
}
