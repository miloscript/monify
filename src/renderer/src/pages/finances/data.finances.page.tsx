import { openDialog } from '@renderer/api/main.api'
import { MainLayout } from '@renderer/components/_layouts/main.layout.component'
import { ComboBox } from '@renderer/components/atoms/combo-box/combo-box.component'
import { Table } from '@renderer/components/atoms/table/table.component'
import { Button } from '@renderer/components/elements/button/button.component'
import { cn } from '@renderer/lib/utils'
import useDataStore from '@renderer/store/data.store'
import { ColumnDef, ColumnFiltersState, createColumnHelper } from '@tanstack/react-table'
import { XIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { BankAccountTypeEnum, BankBankEnum } from '../../../../shared/data.enums'
import { BankAccount, BankTransaction } from '../../../../shared/data.types'

const initialAccount: BankAccount = {
  id: 'd59be728-5128-4e75-9e91-ef2ec4bd04fb',
  number: '265110031008489974',
  bank: BankBankEnum.Raiffeisen,
  type: BankAccountTypeEnum.Personal,
  transactions: []
}

export const transactionsTableConfig = () => {
  const columnHelper = createColumnHelper<BankTransaction>()

  const columns = [
    columnHelper.accessor('valueDate', {
      header: () => 'Value Date',
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor('beneficiaryOrderingParty', {
      header: () => 'Beneficiary',
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor('paymentPurpose', {
      header: () => 'Purpose',
      cell: (info) => info.renderValue()
    }),
    columnHelper.accessor('paymentCode', {
      header: () => 'Payment code',
      cell: (info) => info.renderValue(),
      filterFn: (row, id, value) => {
        return value ? row.getValue(id) === value : true
      }
    }),
    columnHelper.accessor('creditAmount', {
      header: () => 'Credit Amount',
      cell: (info) => info.getValue().toString(),
      filterFn: (row, id, value) => {
        const amount = row.getValue(id) as number
        return value ? amount > 0 : true
      }
    }),
    columnHelper.accessor('debitAmount', {
      header: () => 'Debit Amount',
      cell: (info) => info.getValue().toString(),
      filterFn: (row, id, value) => {
        const amount = row.getValue(id) as number
        return value ? amount > 0 : true
      }
    }),
    columnHelper.accessor('id', {
      header: () => 'Actions',
      cell: ''
    })
  ] as Array<ColumnDef<BankTransaction, unknown>>
  return columns
}

export const FinancesDataPage: React.FC = () => {
  const {
    addBankAccount,
    addBankTransactions,
    user: { bankAccounts }
  } = useDataStore((state) => state)
  const { bankTransactions } = useDataStore((state) => {
    return {
      bankTransactions: state.user.bankAccounts
        .filter((account) => account.number === initialAccount.number)
        .flatMap((account) => account.transactions)
    }
  })
  const [globalFilter, setGlobalFilter] = useState('')
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const handleOpenDialog = async () => {
    const stringMatrix: string[][] = []
    const dialog = await openDialog()
    const xlsData = dialog.Sheets['AccountTurnover']
    Object.keys(xlsData).forEach((key) => {
      // const char = key[0];
      const number = parseInt(key.slice(1), 10)
      if (number < 6) return
      if (isNaN(number)) return
      if (stringMatrix[number]) {
        stringMatrix[number].push(xlsData[key].r)
      } else {
        stringMatrix[number] = []
        stringMatrix[number].push(xlsData[key].r)
      }
    })
    const parsed: BankTransaction[] = stringMatrix.map((arr) => {
      return {
        id: uuidv4(),
        valueDate: arr[0],
        beneficiaryOrderingParty: arr[1],
        beneficiaryOrderingAddress: arr[2],
        beneficiaryAccountNumber: arr[3],
        paymentCode: arr[4],
        paymentPurpose: arr[5],
        debitModel: arr[6],
        debitReferenceNumber: arr[7],
        creditModel: arr[8],
        creditReferenceNumber: arr[9],
        debitAmount: parseFloat(arr[10]),
        creditAmount: parseFloat(arr[11]),
        yourReferenceNumber: arr[12],
        complaintNumber: arr[13],
        paymentReferenceNumber: arr[14]
      }
    })
    const filtered = parsed
      .filter((item) => item !== undefined)
      .filter((item) => !item.valueDate.includes('Prethodno stanje'))
    const newValues = filtered.filter(
      (item2) =>
        !bankTransactions.some(
          (item1) =>
            item1.valueDate === item2.valueDate &&
            item1.beneficiaryOrderingParty === item2.beneficiaryOrderingParty &&
            item1.beneficiaryOrderingAddress === item2.beneficiaryOrderingAddress &&
            item1.beneficiaryAccountNumber === item2.beneficiaryAccountNumber &&
            item1.paymentCode === item2.paymentCode &&
            item1.paymentPurpose === item2.paymentPurpose &&
            item1.debitModel === item2.debitModel &&
            item1.debitReferenceNumber === item2.debitReferenceNumber &&
            item1.creditModel === item2.creditModel &&
            item1.creditReferenceNumber === item2.creditReferenceNumber &&
            item1.debitAmount === item2.debitAmount &&
            item1.creditAmount === item2.creditAmount &&
            item1.yourReferenceNumber === item2.yourReferenceNumber &&
            item1.complaintNumber === item2.complaintNumber &&
            item1.paymentReferenceNumber === item2.paymentReferenceNumber
        )
    )
    if (!bankAccounts.some((account) => account.number === initialAccount.number)) {
      addBankAccount(initialAccount)
    }
    addBankTransactions(newValues, initialAccount.id)
  }

  const paymentCodes = useMemo(() => {
    const codes = new Set(bankTransactions.map((t) => t.paymentCode))
    return Array.from(codes)
      .filter(Boolean)
      .map((code) => ({
        value: code,
        label: code
      }))
  }, [bankTransactions])

  const selectedPaymentCode = columnFilters.find((f) => f.id === 'paymentCode')?.value as string

  return (
    <MainLayout
      crumbs={[
        { name: 'Finances', path: '/finances' },
        { name: 'Finance Data', path: '/finances/data' }
      ]}
      actions={[{ name: 'Import XLS', onClick: handleOpenDialog }]}
    >
      <div className="space-y-4">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setColumnFilters((prev) => {
                const creditFilter = prev.find((f) => f.id === 'creditAmount')
                return creditFilter
                  ? prev.filter((f) => f.id !== 'creditAmount')
                  : [...prev, { id: 'creditAmount', value: true }]
              })
            }}
            className={cn(
              columnFilters.some((f) => f.id === 'creditAmount') &&
                'bg-primary text-primary-foreground'
            )}
          >
            Show Incoming
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setColumnFilters((prev) => {
                const debitFilter = prev.find((f) => f.id === 'debitAmount')
                return debitFilter
                  ? prev.filter((f) => f.id !== 'debitAmount')
                  : [...prev, { id: 'debitAmount', value: true }]
              })
            }}
            className={cn(
              columnFilters.some((f) => f.id === 'debitAmount') &&
                'bg-primary text-primary-foreground'
            )}
          >
            Show Outgoing
          </Button>
          <div className="flex items-center gap-2">
            <ComboBox
              value={selectedPaymentCode}
              onValueChange={(value) => {
                setColumnFilters((prev) => {
                  const paymentCodeFilter = prev.find((f) => f.id === 'paymentCode')
                  return value
                    ? paymentCodeFilter
                      ? prev.map((f) => (f.id === 'paymentCode' ? { ...f, value } : f))
                      : [...prev, { id: 'paymentCode', value }]
                    : prev.filter((f) => f.id !== 'paymentCode')
                })
              }}
              selectPlaceholder="Select payment code..."
              searchPlaceholder="Search payment codes..."
              noResultsText="No payment codes found."
              items={paymentCodes}
            />
            {selectedPaymentCode && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setColumnFilters((prev) => prev.filter((f) => f.id !== 'paymentCode'))
                }}
              >
                <XIcon className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        <Table
          data={bankTransactions}
          columns={transactionsTableConfig()}
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
          columnFilters={columnFilters}
          onColumnFiltersChange={setColumnFilters}
        />
      </div>
    </MainLayout>
  )
}
