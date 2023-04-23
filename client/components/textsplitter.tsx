export default function TextSplitter({ text, className }: { text: string; className?: string; }) {
  return (<div className={"flex gap-4 items-center " + className}>
    <span className="flex-1 border h-0 border-black"></span>
    <span className="font-semibold">{text}</span>
    <span className="flex-1 border h-0 border-black"></span>
  </div>)
}