import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { getComposeFile, getEnvFile } from "@/utils/readContentFiles";
import EditorClientWrapper from "@/components/editor/EditorClientWrapper";
import ContainerActions from "@/components/container/ContainerActions";
import EnvBlock from "@/components/blocks/EnvBlock";
import LogViewer from "@/components/blocks/LogViewer";
import DomainAdd from "@/components/blocks/DomainAdd";
import { getContainer as fetchContainerData } from "@/utils/container";
import DomainAddDialog from "@/components/dialog/DomainAddDialog";
import GeneralSettings from "@/components/blocks/GeneralSettings";

// ---------- STATUS BADGE (SERVER SAFE) ----------
function StatusBadge({ status }: { status: string }) {
  const color =
    status === "Running"
      ? "bg-green-600 text-white"
      : status === "Starting"
        ? "bg-blue-600 text-white"
        : status === "Deploying"
          ? "bg-yellow-600 text-white"
          : "bg-red-600 text-white";

  return (
    <span className={`text-sm px-3 py-1 rounded-md font-medium ${color}`}>
      {status}
    </span>
  );
}

// ---------- MAIN PAGE ----------
export default async function ContainerPage(props: {
  params: Promise<{ slug: string; container: string }>;
}) {
  const { slug, container } = await props.params;

  const compose = await getComposeFile(slug, container);
  const envFile = await getEnvFile(slug, container);

  // Fetch container info
  const containerData = await fetchContainerData(slug, container);
  const containerInfo = containerData?.container;

  const projectName = String(slug);
  const containerName = String(container);

  return (
    <div className="w-full flex justify-center py-10">
      <div className="w-full max-w-5xl space-y-10 px-6">
        {/* ---------- HEADER ---------- */}
        <div className="bg-background border border-border rounded-xl shadow-lg p-8 space-y-4">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-bold text-foreground tracking-wide">
              {slug.toUpperCase()}
              <span className="text-primary"> / </span>
              {container.toUpperCase()}
            </h1>

            {/* STATUS BADGE */}
            {containerInfo?.status && (
              <StatusBadge status={containerInfo.status} />
            )}
          </div>

          <p className="text-muted-foreground text-md">
            Manage, deploy & configure your container
          </p>

          {/* ContainerActions is already a client component */}
          <div className="pt-2">
            <ContainerActions project={slug} container={container} />
          </div>
        </div>

        {/* ---------- TABS ---------- */}
        <div className="bg-background border border-border rounded-xl shadow-lg p-8">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="bg-muted border border-border">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="logs">Logs</TabsTrigger>
              <TabsTrigger value="domains">Domains</TabsTrigger>
              <TabsTrigger value="env">Environment</TabsTrigger>
            </TabsList>

            {/* ---------- COMPOSE ---------- */}
            <TabsContent value="general" className="mt-6">
              <SectionCard title="General Settings" accent="text-foreground">
                <GeneralSettings projectName={slug} containerName={container} />

                <EditorClientWrapper
                  initial={compose}
                  project={slug}
                  container={container}
                  type="compose"
                />
              </SectionCard>
            </TabsContent>

            {/* ---------- ENV ---------- */}
            <TabsContent value="env" className="mt-6">
              <SectionCard title="container.env" accent="text-foreground">
                <EnvBlock
                  projectName={projectName}
                  containerName={containerName}
                />
              </SectionCard>
            </TabsContent>

            {/* ---------- LOGS ---------- */}
            <TabsContent value="logs" className="mt-6">
              <SectionCard title="Logs" accent="text-foreground">
                <LogViewer channels={[`${projectName}-${containerName}`]} />
              </SectionCard>
            </TabsContent>

            {/* ---------- DOMAINS ---------- */}
            <TabsContent value="domains" className="mt-6">
              <DomainAddDialog
                containerName={containerName}
                projectName={projectName}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

// ---------- REUSABLE CARD ----------
export function SectionCard({ title, accent, children }: any) {
  return (
    <div className="bg-muted/30 border border-border rounded-xl p-6 space-y-4 shadow-sm">
      <h2 className={`text-xl font-semibold tracking-wide ${accent}`}>
        {title}
      </h2>
      {children}
    </div>
  );
}
