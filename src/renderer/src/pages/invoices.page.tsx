import { Typography } from '@renderer/components/elements/typography/typography.component'
import { MainLayout } from '@renderer/components/main.layout.component'
import useDataStore from '@renderer/store/data.store'

export const InvoicesPage: React.FC = () => {
  const state = useDataStore((state) => state)

  // const [invoiceConfig, setInvoiceConfig] = useState({
  //   invoiceDate: '01.01.2024',
  //   invoiceNumber: 'MOT01/24',
  //   performancePeriod: '01.01.2024 - 01.02.2024'
  // })

  // const ipcHandle = (value: string): void => window.electron.ipcRenderer.send('ping', value)

  // const invoiceConfigSet = (key: string, value: string): void => {
  //   setInvoiceConfig({ ...invoiceConfig, [key]: value })
  //   ipcHandle(value)
  // }
  return (
    <MainLayout>
      <Typography element="h3">Invoice config</Typography>
      {state.company.name && <Typography element="h3">{state.company.name}</Typography>}
      {/* <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <FormLabel>Invoice date</FormLabel>
          <FormInput
            name="invoice-date"
            placeholder="01.01.2024"
            onChange={(e) => {
              invoiceConfigSet('invoiceDate', e.target.value)
            }}
          />
        </div>
        <div className="flex flex-col gap-2">
          <FormLabel>Invoice number</FormLabel>
          <FormInput
            name="invoice-number"
            placeholder="MOT01/2024"
            onChange={(e) => {
              invoiceConfigSet('invoiceNumber', e.target.value)
            }}
          />
        </div>
        <div className="flex flex-col gap-2">
          <FormLabel>Performance period</FormLabel>
          <FormInput
            name="performance-period"
            placeholder="01.01.2024 - 01.02.2024"
            onChange={(e) => {
              invoiceConfigSet('performancePeriod', e.target.value)
            }}
          />
        </div>
      </div> */}
    </MainLayout>
  )
}
