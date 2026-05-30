'use client'

import { useState, useEffect } from 'react'
import { Command as CommandPrimitive } from 'cmdk'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from '@/components/ui/dialog'

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [value, setValue] = useState('')

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        // Toggle palette
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 shadow-lg">
        <DialogHeader className="sr-only">
          Command Palette
        </DialogHeader>
        <div className="overflow-hidden rounded-lg border border-border">
          <div className="flex items-center border-b border-border px-4 py-3">
            <Search className="w-4 h-4 text-muted-foreground mr-3" />
            <input
              placeholder="Search resources, navigate pages, trigger workflows..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              autoFocus
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={onClose}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>

          <div className="p-2 space-y-1 max-h-96 overflow-auto">
            <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
              Suggested
            </div>
            <div className="text-xs text-muted-foreground p-2 text-center">
              No commands available yet
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
