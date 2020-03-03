export const range = (start, end,step) => {
    const arr2 = []
    for (let i = start; i <= end; i += step){
        arr2.push(i)
    }
    //const arr = Array.from({length:(end - start)}, (v,k) => k+start)
    return arr2
}