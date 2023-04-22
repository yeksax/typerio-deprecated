export default function TextSplitter({ text }: { text: string; }) {
  return (<div className="flex gap-4 items-center">
    <span className="flex-1 border h-0 border-black"></span>
    <span className="font-semibold">{text}</span>
    <span className="flex-1 border h-0 border-black"></span>
  </div>)
}