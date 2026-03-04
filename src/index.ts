import express from 'express'

const app = express()

app.get('/', (_req, res) => {
  res.send('Hello Express!')
})

app.get('/api/weather/:city', async (req, res) => {
  try {
    const city = req.params.city
    const units = req.query.units as string | undefined

    const normalisedUnits = req.query.units === 'imperial' ? 'imperial' : 'metric'

    const geoParams = new URLSearchParams({
      name: city,
      count: '1',
      language: 'en',
      format: 'json'
    })

    const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${geoParams}`)

    if (!geoResponse.ok) {
      return res.status(geoResponse.status).json({
        error: 'Failed to fetch geocoding data'
      })
    }

    const geoData = await geoResponse.json()
    if (!geoData.results || geoData.results.length === 0) {
      return res.status(404).json({ error: `City '${city}' not found`})
    }

    const location = geoData.results[0]
    const { name, country, latitude, longitude } = location

    const weatherParams: Record<string, string> = {
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      current: 'temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m',
      timezone: 'auto'
    }

    if (units === 'imperial') {
      weatherParams.temperature_unit = 'fahrenheit'
      weatherParams.wind_speed_unit = 'mph'
    }

    const weatherUrlParams = new URLSearchParams(weatherParams)
    const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?${weatherUrlParams}`)
    
    if (!weatherResponse.ok) {
      return res.status(weatherResponse.status).json({
        error: 'Failed to fetch weather data'
      })
    }

    const weatherData = await weatherResponse.json()

    res.json({
      city: name,
      country,
      latitude,
      longitude,
      units: normalisedUnits,
      current: weatherData.current
    })

  } catch (error)  {
    console.error('Weather API error:', error)
    res.status(500).json({
      error: 'Failed to fetch weather data',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

export default app
