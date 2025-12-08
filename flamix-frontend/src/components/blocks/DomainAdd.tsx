"use client";

import { useEffect, useState } from "react";
import { getContainer, updateContainer } from "@/utils/container";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExternalLink, SquarePen, Trash2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";

import { Switch } from "@/components/ui/switch";

interface DomainEntry {
  domain: string;
  displayName: string;
  port: number;
  ssl: boolean;
}

interface DomainAddProps {
  projectName: string;
  containerName: string;
  open: boolean;
  setOpen: (v: boolean) => void;
}

export default function DomainAdd({
  projectName,
  containerName,
  open,
  setOpen,
}: DomainAddProps) {
  const [domains, setDomains] = useState<DomainEntry[]>([]);

  // Add domain state
  const [newDomain, setNewDomain] = useState("");
  const [newDisplay, setNewDisplay] = useState("");
  const [newPort, setNewPort] = useState("");
  const [newSSL, setNewSSL] = useState(false);

  // Edit domain state
  const [editOpen, setEditOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editData, setEditData] = useState<DomainEntry>({
    domain: "",
    displayName: "",
    port: 3000,
    ssl: false,
  });

  useEffect(() => {
    async function load() {
      const res = await getContainer(projectName, containerName);
      setDomains(res.container?.domains || []);
    }
    load();
  }, [projectName, containerName]);

  const updateDomains = async (updated: DomainEntry[]) => {
    setDomains(updated);
    await updateContainer(projectName, containerName, { domains: updated });
  };

  const addDomain = () => {
    if (!newDomain.trim()) return;

    const entry: DomainEntry = {
      domain: newDomain.trim(),
      displayName: newDisplay.trim(),
      port: parseInt(newPort),
      ssl: newSSL,
    };

    updateDomains([...domains, entry]);
    setNewDomain("");
    setNewDisplay("");
    setNewPort("");
    setNewSSL(false);
    setOpen(false);
  };

  const removeDomain = (i: number) => {
    updateDomains(domains.filter((_, index) => index !== i));
  };

  const openEditDialog = (i: number) => {
    setEditIndex(i);
    setEditData(domains[i]);
    setEditOpen(true);
  };

  const saveEdit = () => {
    if (editIndex === null) return;

    const updated = [...domains];
    updated[editIndex] = editData;
    updateDomains(updated);
    setEditOpen(false);
  };

  return (
    <Card className="w-full max-w-4xl bg-transparent border-0 shadow-sm p-4">
      <CardContent className="space-y-4">
        {/* ------------------- ADD DOMAIN DIALOG ------------------- */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Domain</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-3">
              <div>
                <Label>Domain</Label>
                <Input
                  placeholder="example.com"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                />
              </div>

              <div>
                <Label>Display Name</Label>
                <Input
                  placeholder="Frontend App"
                  value={newDisplay}
                  onChange={(e) => setNewDisplay(e.target.value)}
                />
              </div>

              <div>
                <Label>Port</Label>
                <Input
                  placeholder="3000"
                  type="number"
                  value={newPort}
                  onChange={(e) => setNewPort(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Enable SSL</Label>
                <Switch checked={newSSL} onCheckedChange={setNewSSL} />
              </div>
            </div>

            <DialogFooter>
              <Button onClick={addDomain}>Save Domain</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ------------------- EDIT DOMAIN DIALOG ------------------- */}
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Domain</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-3">
              <div>
                <Label>Domain</Label>
                <Input
                  value={editData.domain}
                  onChange={(e) =>
                    setEditData({ ...editData, domain: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Display Name</Label>
                <Input
                  value={editData.displayName}
                  onChange={(e) =>
                    setEditData({ ...editData, displayName: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Port</Label>
                <Input
                  type="number"
                  value={editData.port}
                  onChange={(e) =>
                    setEditData({ ...editData, port: parseInt(e.target.value) })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Enable SSL</Label>
                <Switch
                  checked={editData.ssl}
                  onCheckedChange={(v) => setEditData({ ...editData, ssl: v })}
                />
              </div>
            </div>

            <DialogFooter>
              <Button onClick={saveEdit}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ------------------- DOMAIN CARDS ------------------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 cursor-pointer">
          {domains.map((d, i) => (
            <div
              key={i}
              className="bg-card/90 p-4 rounded-xl border border-border transition-all hover:shadow-md  hover:scale-[1.02] flex flex-col justify-between gap-3"
            >
              <div className="space-y-1">
                {/* HEADER */}
                <div className="flex justify-between items-center">
                  {/* DOMAIN (Main + Bold) */}
                  <h3 className="font-bold text-sm">{d.domain}</h3>

                  {/* BUTTONS */}
                  <div className="flex items-center gap-1">
                    {/* OPEN LINK */}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="hover:bg-primary/10"
                      onClick={() =>
                        window.open(`https://${d.domain}`, "_blank")
                      }
                    >
                      <ExternalLink size={16} />
                    </Button>

                    {/* EDIT */}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="hover:bg-primary/10"
                      onClick={() => openEditDialog(i)}
                    >
                      <SquarePen size={16} />
                    </Button>
                  </div>
                </div>

                {/* Display Name (small) */}
                <p className="text-[11px] text-muted-foreground">
                  {d.displayName}
                </p>

                {/* Port */}
                <p className="text-xs">Port: {d.port}</p>

                {/* SSL BADGE */}
                <span
                  className={`
                    px-2 py-1 rounded-md text-xs font-medium w-fit
                    ${d.ssl ? "bg-green-600/20 text-green-500" : "bg-red-600/20 text-red-400"}
                  `}
                >
                  {d.ssl ? "SSL Enabled" : "SSL Disabled"}
                </span>
              </div>

              {/* DELETE */}
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removeDomain(i)}
                className="flex items-center gap-2 w-full"
              >
                <Trash2 size={14} />
                Delete
              </Button>
            </div>
          ))}

          {domains.length === 0 && (
            <p className="text-sm text-muted-foreground col-span-full">
              No domains added yet.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
