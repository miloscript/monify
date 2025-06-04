import { MainLayout } from '@renderer/components/_layouts/main.layout.component'
import { MappedForm } from '@renderer/components/atoms/mapped-form/mapped-form.component'
import useDataStore from '@renderer/store/data.store'
import { TransactionLabel } from '@shared/data.types'
import { SaveIcon } from 'lucide-react'
import { useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { addLabelFormConfig } from './add-label.form.config'
import { addLabelSchema } from './add-label.form.schema'

export const AddLabelFinancesPage: React.FC = () => {
  const navigate = useNavigate()
  const { id: labelId } = useParams()
  const formRef = useRef<HTMLFormElement>(null)
  const { addLabel, updateLabel, user } = useDataStore((state) => ({
    addLabel: state.addLabel,
    updateLabel: state.updateLabel,
    user: state.user
  }))

  // Get all unique recipients from transactions
  const recipients = Array.from(
    new Set(
      user.bankAccounts.flatMap((account) =>
        account.transactions.map((t) => t.beneficiaryOrderingParty)
      )
    )
  ).filter(Boolean)

  const existingLabel = user.app.config.transaction.labels.find((label) => label.id === labelId)
  const isEdit = !!existingLabel

  const onSubmit = (data: { name: string; recipient: string }) => {
    const label: TransactionLabel = {
      id: labelId || uuidv4(),
      name: data.name,
      accountId: user.bankAccounts[0]?.id || '',
      recipient: data.recipient
    }

    if (isEdit && labelId) {
      updateLabel(labelId, label)
    } else {
      addLabel(label)
    }
    navigate('/finances/labels')
  }

  return (
    <MainLayout
      crumbs={[
        { name: 'Finances', path: '/finances' },
        { name: 'Labels', path: '/finances/labels' },
        { name: isEdit ? 'Edit Label' : 'Add Label', path: '/finances/labels/add' }
      ]}
      actions={[
        {
          name: 'Cancel',
          variant: 'secondary',
          onClick: () => navigate('/finances/labels')
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
          name: existingLabel?.name || '',
          recipient: existingLabel?.recipient || ''
        }}
        formMap={addLabelFormConfig(recipients)}
        validationSchema={addLabelSchema}
      />
    </MainLayout>
  )
}
