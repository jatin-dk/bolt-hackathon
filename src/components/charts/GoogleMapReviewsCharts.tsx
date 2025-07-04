import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Star, Clock, TrendingUp } from 'lucide-react'
import { useDataStore } from '../../store/dataStore'
import { RatingTrendChart } from './google-maps-reviews/RatingTrendChart'
import { ReviewsByLocationChart } from './google-maps-reviews/ReviewsByLocationChart'
import { ReviewsByCityStateChart } from './google-maps-reviews/ReviewsByCityStateChart'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Button } from '../ui/button'

export const GoogleMapReviewsCharts: React.FC = () => {
  const { getPageData } = useDataStore()
  const data = getPageData('googleMapReviews')
  const [cityStateGroupBy, setCityStateGroupBy] = useState<'city' | 'state'>('city')

  if (!data) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <CardTitle className="mb-2">No data uploaded</CardTitle>
            <CardDescription>Upload your Google Map reviews data to see visualizations.</CardDescription>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.metadata.totalRecords.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Review records</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">File Size</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(data.size / 1024 / 1024).toFixed(1)} MB</div>
            <p className="text-xs text-muted-foreground">Data processed</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Type</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.type.toUpperCase()}</div>
            <p className="text-xs text-muted-foreground">Format detected</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="rating-trend">
        <TabsList>
          <TabsTrigger value="rating-trend">Rating Trend</TabsTrigger>
          <TabsTrigger value="reviews-by-country">Reviews by Country</TabsTrigger>
          <TabsTrigger value="reviews-by-city-state">Reviews by City/State</TabsTrigger>
        </TabsList>

        <TabsContent value="rating-trend">
          <Card>
            <CardHeader>
              <CardTitle>Rating Distribution Over Time</CardTitle>
              <CardDescription>
                **Q1: How has your rating trended over time?** This chart shows the distribution of your five-star review ratings per month.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RatingTrendChart data={data.data} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reviews-by-country">
          <Card>
            <CardHeader>
              <CardTitle>Reviews per Country</CardTitle>
              <CardDescription>
                **Q2: How many reviews have you given per country?** This chart shows the count of your reviews grouped by the country.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ReviewsByLocationChart data={data.data} groupBy="country" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews-by-city-state">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Reviews by {cityStateGroupBy === 'city' ? 'City' : 'State'}</CardTitle>
                <CardDescription>
                  **Q2 (Detail): What are your most reviewed cities and states?** This chart parses the address to group reviews.
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant={cityStateGroupBy === 'city' ? 'default' : 'outline'} onClick={() => setCityStateGroupBy('city')}>Group by City</Button>
                <Button variant={cityStateGroupBy === 'state' ? 'default' : 'outline'} onClick={() => setCityStateGroupBy('state')}>Group by State</Button>
              </div>
            </CardHeader>
            <CardContent>
              <ReviewsByCityStateChart data={data.data} groupBy={cityStateGroupBy} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}