import MobileHeader from "@/components/layout/mobile-header";
import BottomNavigation from "@/components/layout/bottom-navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Terminal, 
  Search, 
  Shield, 
  Network, 
  HardDrive,
  Bug,
  Eye,
  Lock,
  Zap,
  FileText,
  ExternalLink
} from "lucide-react";

export default function Tools() {
  const toolCategories = [
    {
      title: "Network Analysis",
      icon: Network,
      color: "text-blue-600",
      bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
      tools: [
        {
          name: "Wireshark",
          description: "Network protocol analyzer for packet inspection",
          features: ["Live capture", "Protocol analysis", "Deep inspection"],
          platform: "Cross-platform"
        },
        {
          name: "hping3",
          description: "Custom packet crafting and network testing",
          features: ["Packet crafting", "Port scanning", "Firewall testing"],
          platform: "Linux"
        },
        {
          name: "Nmap",
          description: "Network discovery and security scanning",
          features: ["Port scanning", "OS detection", "Service enumeration"],
          platform: "Cross-platform"
        }
      ]
    },
    {
      title: "Forensics & Analysis",
      icon: Search,
      color: "text-green-600",
      bgColor: "bg-gradient-to-br from-green-50 to-green-100",
      tools: [
        {
          name: "hdparm",
          description: "Hard disk parameter utility for disk analysis",
          features: ["Disk information", "Performance testing", "Security settings"],
          platform: "Linux"
        },
        {
          name: "dd",
          description: "Data duplication and disk imaging tool",
          features: ["Disk imaging", "Data recovery", "Forensic copies"],
          platform: "Unix/Linux"
        },
        {
          name: "hexedit",
          description: "Binary file editor for forensic analysis",
          features: ["Hex editing", "Binary analysis", "File inspection"],
          platform: "Cross-platform"
        }
      ]
    },
    {
      title: "Security Testing",
      icon: Shield,
      color: "text-red-600",
      bgColor: "bg-gradient-to-br from-red-50 to-red-100",
      tools: [
        {
          name: "KFSensor",
          description: "Honeypot intrusion detection system",
          features: ["Attack detection", "Traffic analysis", "Alert system"],
          platform: "Windows"
        },
        {
          name: "Cain & Abel",
          description: "Password recovery and network sniffing",
          features: ["Password cracking", "Network sniffing", "ARP poisoning"],
          platform: "Windows"
        },
        {
          name: "SMAC",
          description: "MAC address spoofing utility",
          features: ["MAC changing", "Network evasion", "Identity masking"],
          platform: "Windows"
        }
      ]
    },
    {
      title: "Malware Analysis",
      icon: Bug,
      color: "text-purple-400",
      tools: [
        {
          name: "njRAT",
          description: "Remote Access Trojan for analysis",
          features: ["Remote control", "Keylogging", "File manipulation"],
          platform: "Windows",
          warning: true
        } as const
      ]
    }
  ];

  const quickCommands = [
    {
      category: "Network Scanning",
      commands: [
        { cmd: "nmap -sS target_ip", desc: "SYN stealth scan" },
        { cmd: "ping -f -l 1472 target", desc: "Test MTU size" },
        { cmd: "tracert target.com", desc: "Trace route to target" }
      ]
    },
    {
      category: "Packet Crafting", 
      commands: [
        { cmd: "hping3 -S target -p 80", desc: "TCP SYN to port 80" },
        { cmd: "hping3 --udp --rand-source target", desc: "UDP with random source" },
        { cmd: "hping3 --scan 1-1000 -S target", desc: "Port scan range" }
      ]
    }
  ];

  return (
    <div className="min-h-screen pb-20">
      <MobileHeader />
      
      {/* Header */}
      <div className="bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 px-4 py-8 mx-4 mt-4 rounded-3xl shadow-lg border border-red-200">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">Security Tools</h1>
        <p className="text-gray-600 text-lg">Essential tools for ethical hacking and security analysis</p>
      </div>

      <main className="px-4 py-6 space-y-6">
        {/* Tool Categories */}
        {toolCategories.map((category, categoryIndex) => {
          const IconComponent = category.icon;
          return (
            <div key={categoryIndex} className={`${category.bgColor} rounded-2xl p-4 shadow-lg border border-opacity-30`}>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-white/80 rounded-xl flex items-center justify-center shadow-sm">
                  <IconComponent className={`w-5 h-5 ${category.color}`} />
                </div>
                <h2 className="text-xl font-bold text-gray-800">{category.title}</h2>
              </div>
              
              <div className="space-y-3">
                {category.tools.map((tool, toolIndex) => (
                  <Card key={toolIndex} className="bg-white/90 border-white/50 hover:bg-white hover:shadow-md transition-all duration-200">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-gray-800 flex items-center space-x-2">
                            <span>{tool.name}</span>
                            {'warning' in tool && tool.warning && (
                              <Badge variant="destructive" className="text-xs bg-red-500 text-white">
                                Caution
                              </Badge>
                            )}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">{tool.description}</p>
                        </div>
                        <Badge variant="outline" className="text-xs border-gray-300 text-gray-600">
                          {tool.platform}
                        </Badge>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mt-3">
                        {tool.features.map((feature, featureIndex) => (
                          <Badge key={featureIndex} variant="secondary" className="text-xs bg-gray-100 text-gray-700 border-gray-200">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}

        {/* Quick Commands */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Terminal className="w-5 h-5 text-[hsl(120,100%,50%)]" />
            <h2 className="text-lg font-semibold">Quick Commands</h2>
          </div>
          
          <div className="space-y-4">
            {quickCommands.map((section, sectionIndex) => (
              <Card key={sectionIndex} className="bg-[hsl(240,6%,10%)] border-[hsl(240,3.7%,15.9%)]">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{section.category}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  {section.commands.map((command, cmdIndex) => (
                    <div key={cmdIndex} className="bg-[hsl(227,39%,23%)]/50 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-1">
                        <code className="text-sm font-mono text-[hsl(120,100%,50%)] break-all">
                          {command.cmd}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 ml-2 flex-shrink-0"
                          onClick={() => navigator.clipboard.writeText(command.cmd)}
                        >
                          <FileText className="w-3 h-3" />
                        </Button>
                      </div>
                      <p className="text-xs text-[hsl(215,16%,47%)]">{command.desc}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* External Resources */}
        <Card className="bg-gradient-to-r from-[hsl(227,39%,23%)] to-[hsl(240,6%,10%)] border-[hsl(120,100%,50%)]/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-3">
              <ExternalLink className="w-5 h-5 text-[hsl(207,90%,54%)]" />
              <h3 className="font-semibold">External Resources</h3>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span>Kali Linux Tools</span>
                <Badge variant="outline" className="text-xs">
                  Official
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>OWASP Testing Guide</span>
                <Badge variant="outline" className="text-xs">
                  Guide
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>NIST Cybersecurity Framework</span>
                <Badge variant="outline" className="text-xs">
                  Framework
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <BottomNavigation />
    </div>
  );
}
