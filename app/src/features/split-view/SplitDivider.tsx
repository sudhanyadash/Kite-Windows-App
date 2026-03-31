interface SplitDividerProps {
  direction: 'horizontal' | 'vertical'
}

export const SplitDivider = ({ direction }: SplitDividerProps) => {
  return (
    <div 
      className={`
        bg-gray-100 hover:bg-kite-orange transition-all duration-200 shrink-0 z-50
        ${direction === 'horizontal' ? 'w-[1.5px] cursor-col-resize h-full mx-[1px]' : 'h-[1.5px] cursor-row-resize w-full my-[1px]'}
        shadow-[0_0_10px_rgba(0,0,0,0.02)]
      `}
    />
  )
}
