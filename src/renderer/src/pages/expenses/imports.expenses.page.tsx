// import transactionsHtml from '@renderer/_data/transactions.mock.html?raw'
import { MainLayout } from '@renderer/components/_layouts/main.layout.component'
import { ComboBox } from '@renderer/components/atoms/combo-box/combo-box.component'
import { Button } from '@renderer/components/elements/button/button.component'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@renderer/components/elements/table/table.component'
import useDataStore from '@renderer/store/data.store'
import { Transaction } from '@shared/data.types'
import isEqual from 'lodash.isequal'
// import { parse } from 'node-html-parser'
import { useEffect, useState } from 'react'
// import { v4 as uuidv4 } from 'uuid'

const parseTransactions = () => {
  const transactions: Transaction[] = []
  // const root = parse(transactionsHtml)
  // const table = root.querySelectorAll('table > tbody > tr')
  // if (!table) return
  // for (let i = 0; i < table.length; i++) {
  //   const element = table[i]
  //   const parsed = parse(element.toString())
  //   const tr = parsed.querySelector('td > table > tbody > tr')
  //   if (!tr) continue
  //   const td = tr.querySelectorAll('td')

  //   // const valueDate = td[0].textContent.trim()
  //   const transactionDate = td[1].textContent.trim()
  //   const payment = parseFloat(td[2].textContent.trim().replace('.', '').replace(',', '.')) || 0
  //   const income = parseFloat(td[3].textContent.trim().replace('.', '').replace(',', '.')) || 0
  //   const description = td[5].textContent.replace(/\s+/g, ' ').trim()

  //   transactions.push({
  //     id: uuidv4(),
  //     date: transactionDate,
  //     type: payment > 0 ? 'out' : 'in',
  //     amount: payment > 0 ? payment : income,
  //     description,
  //     label: {
  //       id: '',
  //       name: ''
  //     }
  //   })
  // }

  return transactions
}

// the transaction has a date field that is a string. 15.03.2024 = > 15 is the month, 03 is the day and 2024 is the year
// we need to sort the transactions array by date from latest to oldest

const sortTransactions = (transactions: Transaction[]) => {
  return transactions.sort((a, b) => {
    const aDate = a.date.split('.')
    const bDate = b.date.split('.')
    return (
      new Date(parseInt(bDate[2]), parseInt(bDate[1]), parseInt(bDate[0])).getTime() -
      new Date(parseInt(aDate[2]), parseInt(aDate[1]), parseInt(aDate[0])).getTime()
    )
  })
}

export const ImportsPage: React.FC = () => {
  const { addTransaction, editTransactionLabel, clearTransactions } = useDataStore((state) => state)
  const { accounts } = useDataStore((state) => state)
  const { labels } = useDataStore((state) => state.app.config.transaction)

  const [storedTransactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    // if (storedTransactions.length === 0) setTransactions(accounts[0].transactions)
    setTransactions(sortTransactions(accounts[0].transactions))
  }, [accounts[0].transactions])

  const onImport = () => {
    const parsed = parseTransactions()
    if (!parsed) return

    // import the transactions but make sure they are unique by checking isEqual without the id
    for (let i = 0; i < parsed.length; i++) {
      const t = parsed[i]
      const existing = accounts[0].transactions.find((e) =>
        isEqual({ ...e, id: '', label: '' }, { ...t, id: '', label: '' })
      )
      if (!existing) addTransaction(accounts[0].id, t)
    }
  }

  const onLabelChange = (labelId: string, transactionId: string) => {
    const label = labels.find((l) => l.id === labelId)
    if (!label) return
    editTransactionLabel(accounts[0].id, transactionId, label)
  }

  const onFilterChange = (labelId: string) => {
    const label = labels.find((l) => l.id === labelId)
    if (labelId === 'uncat') {
      setTransactions(accounts[0].transactions.filter((t) => t.label.id === ''))
      return
    } else if (labelId === 'all') {
      setTransactions(accounts[0].transactions)
    } else if (!label) {
      setTransactions(accounts[0].transactions)
    } else {
      setTransactions(accounts[0].transactions.filter((t) => t.label.id === labelId))
    }
  }

  return (
    <MainLayout
      crumbs={[
        { name: 'Expenses', path: '/expenses' },
        { name: 'Imports', path: '/expenses/imports' }
      ]}
    >
      <div>
        <Button onClick={onImport} variant="default" size="default">
          Trigger import
        </Button>
        <Button
          onClick={() => {
            clearTransactions(accounts[0].id)
          }}
          variant="default"
          size="default"
        >
          Clear
        </Button>
        <div>
          Filter By Label:
          <ComboBox
            onValueChange={onFilterChange}
            searchPlaceholder="Search labels..."
            selectPlaceholder="Select lables..."
            noResultsText="No labels found."
            items={[
              { id: 'all', name: 'All' },
              { id: 'uncat', name: 'Uncategorized' },
              ...labels
            ].map((label) => ({
              value: label.id,
              label: label.name
            }))}
          />
        </div>
      </div>
      <Table>
        <TableCaption>A list of your clients.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Desc</TableHead>
            <TableHead>Labels</TableHead>
            <TableHead className="text-right">Add</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {storedTransactions.map((t) => (
            <TableRow key={t.id}>
              <TableCell>{t.date}</TableCell>
              <TableCell>{t.amount}</TableCell>
              <TableCell>{t.type}</TableCell>
              <TableCell>{t.description}</TableCell>
              <TableCell>{t.label.name}</TableCell>
              <TableCell className="text-right">
                <ComboBox
                  onValueChange={(value) => {
                    onLabelChange(value, t.id)
                  }}
                  searchPlaceholder="Search labels..."
                  selectPlaceholder="Select lables..."
                  noResultsText="No labels found."
                  items={labels.map((label) => ({ value: label.id, label: label.name }))}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </MainLayout>
  )
}
