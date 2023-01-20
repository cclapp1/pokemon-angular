//Formats a name from the api in a good looking format
export function formatName(n: string): string {
    return n.split('-').map(namePart => {
        return namePart.substring(0, 1).toUpperCase() + namePart.substring(1, namePart.length)
    }).join('-').replaceAll('-', ' ')
}

//Undos the same formatting as the previous function
export function unFormatName(n: string): string {
    return n.split(' ').map(namePart => {
        return namePart.toLowerCase()
    }).join(' ').replaceAll(' ', '-')
}