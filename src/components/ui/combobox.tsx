"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Plus } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

interface ComboboxProps {
  options: { value: string; label: string }[]
  value?: string
  onValueChange?: (value: string) => void
  onCreateNew?: (value: string) => void
  placeholder?: string
  className?: string
}

export function Combobox({
  options,
  value,
  onValueChange,
  onCreateNew,
  placeholder = "Selecione uma opção...",
  className,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState("")
  const [showCreateOption, setShowCreateOption] = React.useState(false)

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchValue.toLowerCase())
  )

  const selectedOption = options.find((option) => option.value === value)

  React.useEffect(() => {
    if (searchValue && !filteredOptions.some(option => 
      option.label.toLowerCase() === searchValue.toLowerCase()
    )) {
      setShowCreateOption(true)
    } else {
      setShowCreateOption(false)
    }
  }, [searchValue, filteredOptions])

  const handleSelect = (optionValue: string) => {
    onValueChange?.(optionValue)
    setOpen(false)
    setSearchValue("")
  }

  const handleCreateNew = () => {
    if (searchValue.trim()) {
      onCreateNew?.(searchValue.trim())
      setOpen(false)
      setSearchValue("")
    }
  }

  return (
    <div className={cn("relative", className)}>
      <Button
        type="button"
        variant="outline"
        role="combobox"
        aria-expanded={open}
        className="w-full justify-between font-normal"
        onClick={() => setOpen(!open)}
      >
        {selectedOption ? selectedOption.label : placeholder}
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
      
      {open && (
        <Card className="absolute top-full z-50 mt-1 w-full">
          <CardContent className="p-2">
            <div className="space-y-2">
              <Input
                placeholder="Buscar ou criar categoria..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="h-8"
              />
              
              <div className="max-h-60 overflow-auto">
                {filteredOptions.length > 0 ? (
                  <>
                    {filteredOptions.map((option, index) => (
                      <div key={option.value}>
                        <Button
                          type="button"
                          variant="ghost"
                          className="w-full justify-start h-8 px-2 font-normal"
                          onClick={() => handleSelect(option.value)}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              value === option.value ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {option.label}
                        </Button>
                        {index < filteredOptions.length - 1 && (
                          <Separator className="mx-2 w-auto" />
                        )}
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="px-2 py-1 text-sm text-muted-foreground">
                    Nenhuma categoria encontrada
                  </div>
                )}
                
                {showCreateOption && (
                  <>
                    {filteredOptions.length > 0 && <Separator className="mx-2 my-1" />}
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full justify-start h-8 px-2 text-primary font-normal"
                      onClick={handleCreateNew}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Criar &quot;{searchValue}&quot;
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
