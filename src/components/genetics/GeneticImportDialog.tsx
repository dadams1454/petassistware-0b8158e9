import React, { useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { insertGeneticTest } from "@/services/geneticsService"
import { CheckCircle, Circle, XCircle } from "lucide-react"
import { GeneticHealthStatus } from "@/types/genetics"

interface Props {
  dogId: string
}

const GeneticImportDialog = ({ dogId }: Props) => {
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [name, setName] = useState("")
  const [status, setStatus] = useState<GeneticHealthStatus>("unknown");
  const queryClient = useQueryClient()

  const { mutate, isLoading } = useMutation({
    mutationFn: async () => {
      if (!file) {
        throw new Error("No file selected")
      }
      const formData = new FormData()
      formData.append("file", file)
      formData.append("dogId", dogId)
      formData.append("name", name)
      formData.append("status", status)
      return insertGeneticTest(formData)
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Genetic test imported successfully",
      })
      queryClient.invalidateQueries({ queryKey: ["geneticTests", dogId] })
      setOpen(false)
      setFile(null)
      setName("")
      setStatus("unknown")
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      mutate()
    },
    [mutate]
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Import Genetic Test</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import Genetic Test</DialogTitle>
          <DialogDescription>
            Upload a genetic test report to automatically fill in the results.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="file" className="text-right">
              File
            </Label>
            <Input
              type="file"
              id="file"
              onChange={handleFileChange}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <div className="col-span-3 flex items-center space-x-2">
              <Button
                type="button"
                variant="ghost"
                className={status === "clear" ? "bg-muted" : ""}
                onClick={() => setStatus("clear")}
              >
                <CheckCircle
                  className={status === "clear" ? "text-green-500" : ""}
                />
                Clear
              </Button>
              <Button
                type="button"
                variant="ghost"
                className={status === "carrier" ? "bg-muted" : ""}
                onClick={() => setStatus("carrier")}
              >
                <Circle
                  className={status === "carrier" ? "text-yellow-500" : ""}
                />
                Carrier
              </Button>
              <Button
                type="button"
                variant="ghost"
                className={status === "affected" ? "bg-muted" : ""}
                onClick={() => setStatus("affected")}
              >
                <XCircle
                  className={status === "affected" ? "text-red-500" : ""}
                />
                Affected
              </Button>
            </div>
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Importing..." : "Import"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default GeneticImportDialog
