import React from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import {ArrowRightIcon} from "lucide-react"
import { Button } from "../../components/ui/button"
const RecentBattles = ({Trainer , timeBattle}) => {
  return (
    <div>

                  <ul className="divide-y">
                    <li className="flex items-center justify-between p-3">
                      <div className="flex items-center gap-2">
                        <div className="font-medium">{Trainer}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{timeBattle}</div>
                      </div>
                      <Button size="icon" variant="outline">
                        <ArrowRightIcon className="w-4 h-4" />
                        <span className="sr-only">View Battle</span>
                      </Button>
                    </li>
                  
                  </ul>

    </div>
  )
}

export default RecentBattles