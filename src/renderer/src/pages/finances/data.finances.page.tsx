import { openDialog } from '@renderer/api/main.api'
import { MainLayout } from '@renderer/components/_layouts/main.layout.component'
import { Button } from '@renderer/components/elements/button/button.component'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@renderer/components/elements/table/table.component'
import { Typography } from '@renderer/components/elements/typography/typography.component'
import useDataStore from '@renderer/store/data.store'
import { BankAccount, BankTransaction } from '@shared/data.types'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

const initialAccount: BankAccount = {
  id: 'd59be728-5128-4e75-9e91-ef2ec4bd04fb',
  number: '265110031008489974',
  bank: 'Raiffeisen',
  transactions: []
}

export const FinancesDataPage: React.FC = () => {
  const { addBankAccount, addBankTransactions, bankAccounts } = useDataStore((state) => state)
  const { bankTransactions } = useDataStore((state) => {
    return {
      bankTransactions: state.bankAccounts
        .filter((account) => account.number === initialAccount.number)
        .flatMap((account) => account.transactions)
    }
  })

  const [storedTransactions, setStoredTransactions] = useState<BankTransaction[]>(bankTransactions)

  const handleOpenDialog = async () => {
    const stringMatrix: string[][] = []
    const bla = await openDialog()
    const xlsData = bla.Sheets['AccountTurnover']
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

    if (bankAccounts.filter((account) => account.number === initialAccount.number).length === 0) {
      addBankAccount(initialAccount)
    }
    addBankTransactions(initialAccount.id, filtered)
  }
  return (
    <MainLayout
      crumbs={[
        { name: 'Finances', path: '/finances' },
        { name: 'Finance Data', path: '/finances/data' }
      ]}
    >
      <Typography element="h3" className="mb-4">
        Finance Data
      </Typography>
      <div className="flex flex-col gap-y-2">
        <Button onClick={handleOpenDialog}>Import XLS</Button>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Value Date</TableHead>
              <TableHead>Beneficiary</TableHead>
              <TableHead>Purpose</TableHead>
              <TableHead>Payment Code</TableHead>
              <TableHead>Debit Amount</TableHead>
              <TableHead>Credit Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {storedTransactions.map((client) => (
              <TableRow key={client?.id}>
                <TableCell className="font-medium">{client?.valueDate}</TableCell>
                <TableCell>{client?.beneficiaryOrderingParty}</TableCell>
                <TableCell>{client?.paymentPurpose}</TableCell>
                <TableCell>{client?.paymentCode}</TableCell>
                <TableCell>{client?.debitAmount}</TableCell>
                <TableCell>{client?.creditAmount}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost">Edit</Button>
                  <Button variant="ghost">Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </MainLayout>
  )
}
