import { Dispatch, SetStateAction, useState } from 'react'

export type TierListChartState = {
    highlighted: string | null
    setHighlighted: Dispatch<SetStateAction<string | null>>
}
export const useChartState = () => {
    const [highlighted, setHighlighted] = useState<string | null>(null)

    const chartState: TierListChartState = {
        highlighted,
        setHighlighted
    }
    return chartState
}
