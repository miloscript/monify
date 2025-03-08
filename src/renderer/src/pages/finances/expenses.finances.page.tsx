import { MainLayout } from '@renderer/components/_layouts/main.layout.component'
import {
  TableRoot,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@renderer/components/elements/table/table.component'
import { Typography } from '@renderer/components/elements/typography/typography.component'
import useDataStore from '@renderer/store/data.store'
import { BankAccount, BankTransaction } from '@shared/data.types'
import { v4 as uuidv4 } from 'uuid'
const initialAccount: BankAccount = {
  id: 'd59be728-5128-4e75-9e91-ef2ec4bd04fb',
  number: '265110031008489974',
  bank: 'Raiffeisen',
  transactions: []
}

interface IExpense {
  id: string
  bankTransactionId: string
  date: string
  amount: number
  paymentCode: string
  purpose: string
  category: string
  recipient: string
}

const getCategory = (purpose: string): string => {
  purpose = purpose.toUpperCase()
  // remove double whitespaces
  purpose = purpose.replace(/\s+/g, ' ')

  if (purpose.includes('PROVIZIJA BANKE')) return 'Bank Fee'
  if (purpose.includes('NEOPOREZIVA PRIMANJA ZAPOSLENIH')) return 'Salary'
  if (purpose.includes('PROMET ROBE I USLUGA')) return 'Payment'
  if (purpose.includes('KONSULTACIJA')) return 'Payment'
  if (purpose.includes('PDV SEPTEMBAR')) return 'Taxes'
  if (purpose.includes('POREZ NA DODATU VREDNOST')) return 'Taxes'
  if (purpose.includes('PID-')) return 'Taxes'
  return 'Other'
}

const convertToExpense = (transactions: BankTransaction[]): IExpense[] => {
  const mapped: IExpense[] = transactions.map((transaction) => {
    return {
      id: uuidv4(),
      bankTransactionId: transaction.id,
      recipient: transaction.beneficiaryOrderingParty,
      date: transaction.valueDate,
      amount: transaction.debitAmount,
      paymentCode: transaction.paymentCode,
      purpose: transaction.paymentPurpose,
      category: getCategory(transaction.paymentPurpose)
    }
  })

  const salary = mapped
    .filter((expense) => expense.amount > 0)
    .filter((expense) => expense.category === 'Salary')

  const bla = mapped
    .filter((expense) => expense.amount > 0)
    .filter((expense) => expense.category !== 'Salary')

  const sum = bla.reduce((acc, expense) => acc + expense.amount, 0)
  const sumSalary = salary.reduce((acc, expense) => acc + expense.amount, 0)
  console.log(sum, sumSalary)

  return bla
}

export const FinancesExpensesPage: React.FC = () => {
  const { bankTransactions } = useDataStore((state) => {
    return {
      bankTransactions: state.bankAccounts
        .filter((account) => account.number === initialAccount.number)
        .flatMap((account) => account.transactions)
    }
  })

  const items = convertToExpense(bankTransactions)
  return (
    <MainLayout
      crumbs={[
        { name: 'Finances', path: '/finances' },
        { name: 'Finance Data', path: '/finances/expenses' }
      ]}
    >
      <Typography element="h3" className="mb-4">
        Finance Expenses
      </Typography>
      <div className="flex flex-col gap-y-2">
        <TableRoot>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Recipient</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment Code</TableHead>
              <TableHead>Purpose</TableHead>
              <TableHead>Category</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.date}</TableCell>
                <TableCell>{item.recipient}</TableCell>
                <TableCell>{item.amount}</TableCell>
                <TableCell>{item.paymentCode}</TableCell>
                <TableCell>{item.purpose}</TableCell>
                <TableCell>{item.category}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TableRoot>
      </div>
    </MainLayout>
  )
}
