import { Request, Response } from 'express'
import Urls from '../models/Urls'
import Sessions from '../models/Sessions'
import { isURL, IsURLOptions } from 'validator'


export async function handleRedirect(req: Request, res: Response){
    try {
        const shortId = req.params['shortId']

        if (!isValidShortId(shortId)) return res.status(400).json({ message: 'Invalid ShortId' })

        const url = await Urls.findOne({ shortId: shortId })
        if (!url) return res.status(404).json({ message: 'URL not found' })

        url.views ++
        await url.save()

        res.redirect(url.url)
    } catch (e) {
        console.error(e)
        res.status(500).json({ message: 'Internal server error' })
    }    
}

export async function shortenUrl(req: Request, res: Response){
    try {
        const { url } = req.body
        const { sessionId } = req.cookies

        if (!isValidUrl(url)) return res.status(400).json({ message: 'Invalid URL' })

        const session = await getSessionById(sessionId)
        if (!session) return res.status(404).json({ message: 'Session not found' })

        const userId = session.userId

        const shortUrl = await Urls.create({
            userId: userId,
            url: url
        })

        const shortId = shortUrl.shortId

        res.status(200).json({ shortId: shortId })
    } catch (e) {
        console.error(e)
        res.status(500).json({ message: 'Internal server error' })
    }
}

export async function getUrls(req: Request, res: Response){
    const { sessionId } = req.cookies

    if (!sessionId) return res.status(404).json({ message: 'Session ID not found' })

    const session = await getSessionById(sessionId)
    if (!session) return res.status(404).json({ message: 'Session not found' })

    const userId = session.userId
    const urls = await Urls.find({ userId: userId })

    return res.status(200).json(urls)
}

async function getSessionById(sessionId: string): Promise<Sessions | null> {
    return await Sessions.findOne({ sessionId });
}

function isValidShortId(shortId: string): boolean {
    if (shortId.length !== 6) return false

    const shortIdRegex = /^[A-Za-z0-9_-]{6}$/
    return shortIdRegex.test(shortId)
}

function isValidUrl(url: string): boolean {
    const options: IsURLOptions = { protocols: ['https'], require_valid_protocol: true }
    return isURL(url, options)
}