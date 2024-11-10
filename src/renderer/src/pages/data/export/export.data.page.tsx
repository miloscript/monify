import ReactJson from '@microlink/react-json-view'
import { exportAndOpenDownloads } from '@renderer/api/main.api'
import { MainLayout } from '@renderer/components/_layouts/main.layout.component'
import { Button } from '@renderer/components/elements/button/button.component'
import useDataStore from '@renderer/store/data.store'
import { useState } from 'react'

export const ExportPage: React.FC = () => {
  const state = useDataStore((state) => state)
  const [showDebug, setShowDebug] = useState(false)

  const onExport = () => {
    exportAndOpenDownloads()
  }

  return (
    <MainLayout crumbs={[{ name: 'Data', path: '/data' }]}>
      <div className="flex flex-col items-start gap-y-4">
        <Button onClick={onExport}>Export</Button>
        <div
          className="flex flex-row gap-x-2 items-center cursor-pointer"
          onClick={() => {
            setShowDebug(!showDebug)
          }}
        >
          <label className="cursor-pointer">Show debug info</label>
          <input className="cursor-pointer" checked={showDebug} type="checkbox" />
        </div>
        {showDebug && (
          <ReactJson
            collapsed={3}
            src={state}
            displayDataTypes={false}
            displayObjectSize={false}
            style={{
              fontSize: '0.6rem'
            }}
          />
        )}
      </div>
    </MainLayout>
  )
}
