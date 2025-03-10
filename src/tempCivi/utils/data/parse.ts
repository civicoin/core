export const safeJsonParse = (message: string, onError?: (message: string) => void): object => {
	try {
		return JSON.parse(message)
	} catch {
		if (onError) onError(message)
		return {}
	}
}
