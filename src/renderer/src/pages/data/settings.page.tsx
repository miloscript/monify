import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@renderer/components/elements/tabs/tabs.component'
import { MainLayout } from '@renderer/components/main.layout.component'
import { ClientsTab } from './tabs/clients/clients.tab.settings'
import { CompanyTab } from './tabs/company.tab.settings'

export const SettingsPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <Tabs defaultValue="company">
          <TabsList className="flex justify-between">
            <div>
              <TabsTrigger value="company">Company</TabsTrigger>
              <TabsTrigger value="clients">Clients</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
            </div>
            <TabsTrigger value="user">User</TabsTrigger>
          </TabsList>
          <TabsContent value="company">
            <CompanyTab />
          </TabsContent>
          <TabsContent value="clients">
            <ClientsTab />
          </TabsContent>
          <TabsContent value="projects">Projects.</TabsContent>
          <TabsContent value="user">User.</TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
