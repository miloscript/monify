import { MainLayout } from '@renderer/components/_layouts/main.layout.component'
import useDataStore from '@renderer/store/data.store'
import { Invoice, InvoiceProject } from '@shared/data.types'
import { useNavigate, useParams } from 'react-router-dom'
import { SaveIcon } from 'lucide-react'
import { useRef } from 'react'
import { MappedForm } from '@renderer/components/atoms/mapped-form/mapped-form.component'
import { v4 as uuidv4 } from 'uuid'
import { addInvoiceFields, addInvoiceSchema } from './add-invoice.form.config'
import { getInvoiceById } from '@renderer/store/data.selectors'

// TODO: doesn't support selecting other clients atm, since the schema needs to read the value
// and dinamically render the fields based on the selected client
export const AddInvoicePage: React.FC = () => {
  const navigate = useNavigate()
  const { id: invoiceId } = useParams()
  const formRef = useRef<HTMLFormElement>(null)

  const invoice = getInvoiceById(useDataStore(), invoiceId)
  const isEdit = !!invoice

  const {
    upsertInvoice,
    user: { clients, company }
  } = useDataStore()

  const onSubmit = (data) => {
    const to = clients.find((client) => client.id === data.companyName)
    const items = Object.keys(data).filter((key) => key.startsWith('hours-'))
    const invoiceProjects: InvoiceProject[] = []
    for (const item of items) {
      const value = data[item] ? data[item] : 0
      const projectId = item.replace('hours-', '')
      const client = clients.find((client) => client.id === data.companyName)
      const project = client?.projects?.find((project) => project.id === projectId)
      invoiceProjects.push({
        ...(project as InvoiceProject),
        hours: value
      })
    }
    if (!to) return
    const invoice: Invoice = {
      id: isEdit ? invoiceId : uuidv4(),
      createdAt: new Date().toISOString(),
      date: data.invoiceDate,
      number: data.invoiceNumber,
      performancePeriod: data.performancePeriod,
      from: company,
      to,
      items: invoiceProjects
    }
    upsertInvoice(invoice)
    navigate('/invoices')
  }

  return (
    <MainLayout
      crumbs={[
        { name: 'Invoices', path: '/' },
        { name: 'All invoices', path: '/invoices' },
        { name: 'Add invoice', path: '/invoices/add' }
      ]}
      actions={[
        {
          name: 'Cancel',
          variant: 'secondary',
          onClick: () => navigate('/invoices')
        },
        {
          name: 'Save',
          icon: <SaveIcon className="size-4 mr-2" />,
          onClick: () => {
            if (!formRef.current) return
            formRef.current.dispatchEvent(
              new Event('submit', {
                bubbles: true
              })
            )
          }
        }
      ]}
    >
      <MappedForm
        ref={formRef}
        handleFormSubmit={onSubmit}
        initialValues={{
          companyName: clients[0].id,
          invoiceDate: invoice?.date || '',
          invoiceNumber: invoice?.number || '',
          performancePeriod: invoice?.performancePeriod || '',
          ...invoice?.items.reduce((acc, item) => {
            acc[`hours-${item.id}`] = item.hours
            return acc
          }, {})
        }}
        formMap={addInvoiceFields(clients, clients[0].id)}
        validationSchema={addInvoiceSchema(clients, clients[0].id)}
      />
    </MainLayout>
  )
}
