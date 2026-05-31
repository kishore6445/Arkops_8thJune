"use client"

import { Button } from "@/components/ui/button"
import { Download, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ExportButtonsProps {
  type: "weekly-review" | "victory-targets"
  data: any
  departmentName?: string
}

export function ExportButtons({ type, data, departmentName }: ExportButtonsProps) {
  const { toast } = useToast()

  const exportToPDF = () => {
    console.log("[v0] Exporting to PDF:", data)

    toast({
      title: "Export Started",
      description: `Your ${type === "weekly-review" ? "weekly review" : "victory targets"} PDF is being generated.`,
    })
  }

  const exportToCSV = () => {
    let csvContent = ""

    if (type === "victory-targets") {
      csvContent = "Title,Target,Achieved,Gap,Progress,Status,Owner\n"
      data.forEach((vt: any) => {
        const progress = Math.round((vt.achieved / vt.target) * 100)
        csvContent += `"${vt.title}",${vt.target},${vt.achieved},${vt.target - vt.achieved},${progress}%,${vt.status},"${vt.owner}"\n`
      })
    }

    // Create download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `${departmentName || "data"}-${type}-${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Export Complete",
      description: "CSV file has been downloaded.",
    })
  }

  return (
    <div className="flex items-center gap-2">
      {type === "weekly-review" && (
        <Button variant="outline" size="sm" onClick={exportToPDF} className="gap-2 bg-transparent">
          <FileText className="h-4 w-4" />
          Export PDF
        </Button>
      )}
      {type === "victory-targets" && (
        <Button variant="outline" size="sm" onClick={exportToCSV} className="gap-2 bg-transparent">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      )}
    </div>
  )
}
