import { default as Axios } from 'axios'

const TokenKey = 'TokenKey'
const ClientId = String(__CLIENT_ID__)
const Origin = globalThis.location.origin
const InvokeEndPoint = `${Origin}/invoke-access-token`
const RevokeEndPoint = `${Origin}/revoke-access-token`

export const getAccessToken = () => localStorage.getItem(TokenKey)
export const removeToken = () => localStorage.removeItem(TokenKey)
const setAccessToken = (token: string) => localStorage.setItem(TokenKey, token)

export const getAuthorization = () => `token ${getAccessToken()}`

export const generateToken = async (code: string) => {
	const resp = await Axios.post(
		InvokeEndPoint,
		{
			code,
		},
		{},
	)

	const accessToken = resp.data?.access_token

	if (!accessToken) {
		return false
	}

	setAccessToken(accessToken)
	return true
}

const Scopes = ['public_repo', 'gist']
export const getAuthorizeLink = (from?: string) => {
	return `https://github.com/login/oauth/authorize?client_id=${ClientId}&redirect_uri=${Origin}/authorize?from=${
		from ?? '/'
	}&scope=${Scopes.join(' ')}`
}

export const revokeToken = async () => {
	const accessToken = getAccessToken()
	removeToken()
	await Axios.patch(RevokeEndPoint, {
		access_token: accessToken,
	})
}
