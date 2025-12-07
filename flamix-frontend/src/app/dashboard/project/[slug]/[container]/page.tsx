// SERVER COMPONENT
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { getComposeFile, getEnvFile } from "@/utils/readContentFiles";
import EditorClientWrapper from "@/components/editor/EditorClientWrapper";
import ContainerActions from "@/components/container/ContainerActions";

export default async function ContainerPage(props: {
  params: Promise<{ slug: string; container: string }>;
}) {
  const { slug, container } = await props.params;

  const compose = await getComposeFile(slug, container);
  const envFile = await getEnvFile(slug, container);

  return (
    <div className="w-full flex justify-center py-10">
      <div className="w-full max-w-6xl space-y-10 px-6">
        {/* HEADER */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-white tracking-wide">
            {slug.toUpperCase()}
            <span className="text-primary"> / </span>
            {container.toUpperCase()}
          </h1>

          <p className="text-neutral-400 text-lg">
            Manage & configure your container
          </p>

          <ContainerActions project={slug} container={container} />
        </div>

        {/* MAIN CONTENT CARD */}
        <div
          className="
          bg-neutral-950/60 
          border border-neutral-800 
          rounded-2xl 
          shadow-xl 
          p-8 
          backdrop-blur-lg
        "
        >
          <Tabs defaultValue="general" className="w-full">
            <TabsList
              className="
              bg-neutral-900 
              border border-neutral-800 
              rounded-xl
              px-3 py-2
            "
            >
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="logs">Logs</TabsTrigger>
              <TabsTrigger value="domains">Domains</TabsTrigger>
              <TabsTrigger value="env">Environment</TabsTrigger>
            </TabsList>

            {/* GENERAL */}
            <TabsContent value="general">
              <SectionCard title="docker-compose.yml" accent="text-blue-400">
                <EditorClientWrapper
                  initial={compose}
                  project={slug}
                  container={container}
                  type="compose"
                />
              </SectionCard>
            </TabsContent>

            {/* ENV */}
            <TabsContent value="env">
              <SectionCard title="container.env" accent="text-green-400">
                <EditorClientWrapper
                  initial={envFile}
                  project={slug}
                  container={container}
                  type="env"
                />
              </SectionCard>
            </TabsContent>

            {/* LOGS */}
            <TabsContent value="logs">
              <SectionCard title="Logs" accent="text-yellow-400">
                <p className="text-neutral-400">Logs feature coming soon...</p>
              </SectionCard>
            </TabsContent>

            {/* DOMAINS */}
            <TabsContent value="domains">
              <SectionCard title="Domains" accent="text-purple-400">
                <p className="text-neutral-400">Domains features coming...</p>
              </SectionCard>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function SectionCard({ title, accent, children }: any) {
  return (
    <div
      className="
      bg-neutral-900/70 
      border border-neutral-800 
      rounded-xl 
      p-6 space-y-4 
      shadow-lg 
      backdrop-blur
    "
    >
      <h2 className={`text-xl font-semibold ${accent}`}>{title}</h2>
      {children}
    </div>
  );
}
