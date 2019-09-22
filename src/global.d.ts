// https://github.com/Microsoft/TypeScript/issues/18642
interface Navigator {
    share: (data: {
        title?: string
        text?: string
        url?: string
        files?: File[]
    }) => Promise<void>
}
