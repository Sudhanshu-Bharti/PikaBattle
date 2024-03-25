import React from 'react'

import {ArrowRightIcon} from "lucide-react"
import { Button } from "../../components/ui/button"

const Explore = ({cityname}) => {
  return (
    <div>
                  <ul className="divide-y">
                    <li className="flex items-center justify-between p-3">
                      <div className="font-medium">{cityname}</div>
                      <Button size="icon" variant="outline">
                        <ArrowRightIcon className="w-4 h-4" />
                        <span className="sr-only">Explore</span>
                      </Button>
                    </li>
                  </ul>

    </div>
  )
}

export default Explore