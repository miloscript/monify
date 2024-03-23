import { MainLayout } from '@renderer/components/main.layout.component'

import { Document, Font, PDFViewer, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import { ReactNode } from 'react'

import useDataStore from '@renderer/store/data.store'
import { InvoiceProject } from '@shared/data.types'
import { useParams } from 'react-router-dom'
import InterBold from '../../assets/fonts/Inter-Bold.ttf'
import InterExtraBold from '../../assets/fonts/Inter-ExtraBold.ttf'
import InterLight from '../../assets/fonts/Inter-Light.ttf'
import InterMedium from '../../assets/fonts/Inter-Medium.ttf'
import interRegular from '../../assets/fonts/Inter-Regular.ttf'

Font.register({
  family: 'Inter',
  fonts: [
    {
      src: InterLight
    },
    {
      src: interRegular
    },
    {
      src: InterMedium
    },
    {
      src: InterBold
    },
    {
      src: InterExtraBold
    }
  ]
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const RegularText = ({ children, style }: { children: ReactNode; style?: any }) => {
  return (
    <Text
      style={{
        fontFamily: 'Inter',
        fontSize: '10px',
        padding: '1px 0px',
        ...style
      }}
    >
      {children}
    </Text>
  )
}

export const ViewInvoicePage: React.FC = () => {
  const { id } = useParams()

  const invoice = useDataStore((state) => state.invoices.find((invoice) => invoice.id === id))

  console.log(invoice)

  return (
    <MainLayout
      crumbs={[
        { name: 'Invoices', path: '/' },
        { name: 'All invoices', path: '/invoices' },
        { name: 'Edit invoice', path: '/invoices/edit' }
      ]}
    >
      <PDFViewer showToolbar={false} width={'100%'} height={'600px'}>
        <Document style={styles.document} pageMode="fullScreen">
          <Page size="A4" style={styles.page}>
            <View style={{ marginBottom: '16px' }}>
              <Text style={styles.heading}>INVOICE</Text>
            </View>
            <View
              style={{
                ...styles.row,
                marginBottom: '20px'
              }}
            >
              <View style={{ width: '100%' }}>
                <RegularText>
                  To:
                  <RegularText style={{ fontWeight: 'bold' }}> {invoice?.to.name}</RegularText>
                </RegularText>
                <RegularText>
                  {`${invoice?.to.address.street} ${invoice?.to.address.number}`}
                </RegularText>
                <RegularText>
                  {`${invoice?.to.address.zip} ${invoice?.to.address.city}, ${invoice?.to.address.country}`}
                </RegularText>
                <RegularText>VAT-ID: 143 / 164 / 10880</RegularText>
              </View>
              <View style={{ width: '100%' }}>
                <RegularText>
                  From:
                  <RegularText style={{ fontWeight: 'bold' }}> {invoice?.from.name}</RegularText>
                </RegularText>
                <RegularText>
                  {`${invoice?.from.address.street} ${invoice?.from.address.number}`}
                </RegularText>
                <RegularText>
                  {`${invoice?.from.address.zip} ${invoice?.from.address.city}, ${invoice?.from.address.country}`}
                </RegularText>
                <RegularText>
                  TAX-ID:
                  {invoice?.from.taxId}
                </RegularText>
              </View>
            </View>
            <View style={{ ...styles.row, marginBottom: '60px' }}>
              <View>
                <RegularText>
                  <RegularText style={{ fontWeight: 'bold' }}>Date:</RegularText> {invoice?.date}
                </RegularText>
                <RegularText>
                  <RegularText style={{ fontWeight: 'bold' }}>Invoice number:</RegularText>{' '}
                  {invoice?.number}
                </RegularText>
                <RegularText>
                  <RegularText style={{ fontWeight: 'bold' }}>Performance period:</RegularText>{' '}
                  {invoice?.performancePeriod}
                </RegularText>
              </View>
            </View>
            <View
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <View
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid #ddd'
                }}
              >
                <RegularText
                  style={{
                    fontWeight: 'bold',
                    padding: '8px',
                    minWidth: '20%'
                  }}
                >
                  Cost center
                </RegularText>
                <RegularText
                  style={{
                    fontWeight: 'bold',
                    padding: '8px',
                    minWidth: '30%'
                  }}
                >
                  Project
                </RegularText>
                <RegularText
                  style={{
                    fontWeight: 'bold',
                    padding: '8px',
                    minWidth: '15%',
                    textAlign: 'right'
                  }}
                >
                  Hourly price
                </RegularText>
                <RegularText
                  style={{
                    fontWeight: 'bold',
                    padding: '8px',
                    minWidth: '15%',
                    textAlign: 'right'
                  }}
                >
                  Hours
                </RegularText>
                <RegularText
                  style={{
                    fontWeight: 'bold',
                    padding: '8px',
                    minWidth: '20%',
                    textAlign: 'right'
                  }}
                >
                  Total price
                </RegularText>
              </View>

              <View
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {invoice?.items.map((item: InvoiceProject) => {
                  return (
                    <View
                      key={item.id}
                      style={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid #000'
                      }}
                    >
                      <RegularText style={{ padding: '8px', minWidth: '20%' }}>
                        {
                          item.additionalFields?.find((field) => field.name === 'Cost center')
                            ?.value
                        }
                      </RegularText>
                      <RegularText style={{ padding: '8px', minWidth: '30%' }}>
                        {item.name}
                      </RegularText>
                      <RegularText
                        style={{
                          padding: '8px',
                          minWidth: '15%',
                          textAlign: 'right'
                        }}
                      >{`€${item.hourlyRate[0].rate}`}</RegularText>
                      <RegularText
                        style={{
                          padding: '8px',
                          minWidth: '15%',
                          textAlign: 'right'
                        }}
                      >{`${item.hours}h`}</RegularText>
                      <RegularText
                        style={{
                          padding: '8px',
                          minWidth: '20%',
                          textAlign: 'right'
                        }}
                      >
                        {`€${item.hourlyRate[0].rate * item.hours}`}
                      </RegularText>
                    </View>
                  )
                })}
              </View>
            </View>
            <View
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <View style={{ ...styles.row }}>
                <RegularText
                  style={{
                    width: '50%',
                    textAlign: 'right'
                  }}
                >
                  {' '}
                </RegularText>
                <RegularText
                  style={{
                    minWidth: '65%',
                    textAlign: 'left',
                    padding: '4px 8px',
                    fontWeight: 'bold'
                  }}
                >
                  Total
                </RegularText>
                <RegularText
                  style={{
                    minWidth: '15%',
                    textAlign: 'right',
                    padding: '4px 8px'
                  }}
                >
                  {/* subtotal of all hours, im getting a string value 01520, fix it */}
                  {invoice?.items.reduce(
                    (acc, item) => acc + parseInt(item.hours as unknown as string),
                    0
                  )}
                  h
                </RegularText>

                <RegularText
                  style={{
                    minWidth: '20%',
                    textAlign: 'right',
                    padding: '4px 8px'
                  }}
                >
                  €
                  {invoice?.items.reduce(
                    (acc, item) => acc + item.hourlyRate[0].rate * item.hours,
                    0
                  )}
                </RegularText>
              </View>
              {/* <View style={{ ...styles.row }}>
                <RegularText
                  style={{
                    width: '65%',
                    textAlign: 'right'
                  }}
                >
                  {' '}
                </RegularText>
                <RegularText
                  style={{
                    minWidth: '15%',
                    textAlign: 'right',
                    padding: '4px 8px'
                  }}
                >
                  Tax (0%)
                </RegularText>
                <RegularText
                  style={{
                    minWidth: '20%',
                    textAlign: 'right',
                    padding: '4px 8px'
                  }}
                >
                  €0.00
                </RegularText>
              </View> */}
              {/* <View style={{ ...styles.row, borderTop: '1px solid #ccc' }}>
                <RegularText
                  style={{
                    width: '65%',
                    textAlign: 'right'
                  }}
                >
                  {' '}
                </RegularText>
                <RegularText
                  style={{
                    fontWeight: 'bold',
                    minWidth: '80%',
                    textAlign: 'left',
                    padding: '4px 8px'
                  }}
                >
                  Total
                </RegularText>
                <RegularText
                  style={{
                    fontWeight: 'bold',
                    minWidth: '20%',
                    textAlign: 'right',
                    padding: '4px 8px'
                  }}
                >
                  €
                  {invoice?.items.reduce(
                    (acc, item) => acc + item.hourlyRate[0].rate * item.hours,
                    0
                  )}
                </RegularText>
              </View> */}
            </View>
            <View
              style={{
                ...styles.row,
                borderTop: '1px solid #ccc',
                marginTop: '50px',
                paddingTop: '10px'
              }}
            >
              <View style={{ ...styles.column, width: '65%', fontSize: '8pt' }}>
                <RegularText style={{ fontStyle: 'normal', fontSize: '8pt' }}>
                  <RegularText style={{ fontWeight: 'bold', fontSize: '8pt' }}>
                    Contact:
                  </RegularText>{' '}
                  {invoice?.from.contact?.name}
                </RegularText>
                <RegularText style={{ fontStyle: 'normal', fontSize: '8pt' }}>
                  <RegularText style={{ fontWeight: 'bold', fontSize: '8pt' }}>
                    Address:
                  </RegularText>{' '}
                  {invoice?.from.address.street} {invoice?.from.address.number}{' '}
                  {invoice?.from.address.city} {invoice?.from.address.zip}{' '}
                  {invoice?.from.address.country}
                </RegularText>
                <RegularText style={{ fontStyle: 'normal', fontSize: '8pt' }}>
                  <RegularText style={{ fontWeight: 'bold', fontSize: '8pt' }}>Email:</RegularText>{' '}
                  {invoice?.from.contact?.email}
                </RegularText>
                <RegularText style={{ fontStyle: 'normal', fontSize: '8pt' }}>
                  <RegularText style={{ fontWeight: 'bold', fontSize: '8pt' }}>Phone:</RegularText>{' '}
                  {invoice?.from.contact?.phone}
                </RegularText>
              </View>
            </View>
          </Page>
        </Document>
      </PDFViewer>
    </MainLayout>
  )
}

const styles = StyleSheet.create({
  viewer: {
    height: '80vh'
  },
  document: {},
  page: {
    fontFamily: 'Inter',
    background: '#fff',
    border: 'none',
    boxShadow: '0 0 20px rgba(80, 80, 80, 0.7)',
    padding: '50px 65px'
  },
  heading: {
    fontSize: '14pt',
    fontWeight: 'bold'
  },
  regular: {
    fontSize: '10pt'
  },
  row: {
    display: 'flex',
    flexDirection: 'row'
  },
  column: {},
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  }
})
