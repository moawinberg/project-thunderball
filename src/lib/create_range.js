export const range = (start, end) => {
    const arr = Array.from({length:(end - start)}, (v,k) => k+start)
    return arr
}