import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Info, 
  AlertTriangle, 
  CheckCircle, 
  Terminal,
  FileText,
  Image as ImageIcon
} from "lucide-react";
import CodeBlock from "./code-block";
import { TutorialLesson, TutorialSection } from "@shared/schema";

interface TutorialContentProps {
  lesson: TutorialLesson;
}

export default function TutorialContent({ lesson }: TutorialContentProps) {
  const renderSection = (section: TutorialSection) => {
    switch (section.type) {
      case "text":
        return (
          <Card key={section.id} className="bg-[hsl(240,6%,10%)] border-[hsl(240,3.7%,15.9%)]">
            <CardContent className="p-4">
              {section.title && (
                <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-[hsl(207,90%,54%)]" />
                  <span>{section.title}</span>
                </h3>
              )}
              <div className="prose prose-invert prose-sm max-w-none">
                {section.content.split('\n').map((paragraph, index) => {
                  if (paragraph.trim() === '') return null;
                  
                  // Handle bullet points
                  if (paragraph.trim().startsWith('•') || paragraph.trim().startsWith('-')) {
                    return (
                      <ul key={index} className="list-disc list-inside text-[hsl(215,16%,47%)] mb-2">
                        <li>{paragraph.replace(/^[•-]\s*/, '')}</li>
                      </ul>
                    );
                  }
                  
                  // Handle numbered lists
                  if (/^\d+\./.test(paragraph.trim())) {
                    return (
                      <ol key={index} className="list-decimal list-inside text-[hsl(215,16%,47%)] mb-2">
                        <li>{paragraph.replace(/^\d+\.\s*/, '')}</li>
                      </ol>
                    );
                  }
                  
                  return (
                    <p key={index} className="text-[hsl(215,16%,47%)] mb-3 leading-relaxed">
                      {paragraph}
                    </p>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );

      case "code":
        return (
          <div key={section.id} className="space-y-2">
            {section.title && (
              <h4 className="text-sm font-medium text-[hsl(207,90%,54%)]">{section.title}</h4>
            )}
            <CodeBlock
              content={section.content}
              language={section.language}
              copyable={section.copyable}
              type="code"
            />
          </div>
        );

      case "command":
        return (
          <div key={section.id} className="space-y-2">
            {section.title && (
              <h4 className="text-sm font-medium text-[hsl(120,100%,50%)]">{section.title}</h4>
            )}
            <CodeBlock
              content={section.content}
              language="bash"
              copyable={section.copyable !== false}
              type="command"
            />
          </div>
        );

      case "warning":
        return (
          <Alert key={section.id} className="border-[hsl(14,100%,60%)]/30 bg-[hsl(14,100%,60%)]/10">
            <AlertTriangle className="w-4 h-4 text-[hsl(14,100%,60%)]" />
            <AlertDescription>
              {section.title && (
                <div className="font-semibold text-[hsl(14,100%,60%)] mb-2">{section.title}</div>
              )}
              <div className="text-[hsl(14,100%,60%)]">{section.content}</div>
            </AlertDescription>
          </Alert>
        );

      case "info":
        return (
          <Alert key={section.id} className="border-[hsl(207,90%,54%)]/30 bg-[hsl(207,90%,54%)]/10">
            <Info className="w-4 h-4 text-[hsl(207,90%,54%)]" />
            <AlertDescription>
              {section.title && (
                <div className="font-semibold text-[hsl(207,90%,54%)] mb-2">{section.title}</div>
              )}
              <div className="text-[hsl(207,90%,54%)]">{section.content}</div>
            </AlertDescription>
          </Alert>
        );

      case "checklist":
        return (
          <Card key={section.id} className="bg-[hsl(240,6%,10%)] border-[hsl(120,100%,50%)]/30">
            <CardContent className="p-4">
              {section.title && (
                <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-[hsl(120,100%,50%)]" />
                  <span>{section.title}</span>
                </h3>
              )}
              <div className="space-y-2">
                {section.content.split('\n').map((item, index) => {
                  if (item.trim() === '') return null;
                  const cleanItem = item.replace(/^[•-]\s*/, '');
                  return (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-4 h-4 mt-0.5 border border-[hsl(120,100%,50%)]/50 rounded-sm flex items-center justify-center">
                        <div className="w-2 h-2 bg-[hsl(120,100%,50%)] rounded-sm opacity-0 hover:opacity-100 transition-opacity cursor-pointer" />
                      </div>
                      <span className="text-[hsl(215,16%,47%)] text-sm">{cleanItem}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );

      case "image":
        return (
          <Card key={section.id} className="bg-[hsl(240,6%,10%)] border-[hsl(240,3.7%,15.9%)]">
            <CardContent className="p-4">
              {section.title && (
                <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
                  <ImageIcon className="w-5 h-5 text-[hsl(207,90%,54%)]" />
                  <span>{section.title}</span>
                </h3>
              )}
              <div className="bg-[hsl(227,39%,23%)]/50 rounded-lg p-8 text-center">
                <ImageIcon className="w-12 h-12 text-[hsl(215,16%,47%)] mx-auto mb-2" />
                <p className="text-sm text-[hsl(215,16%,47%)]">
                  Image: {section.content}
                </p>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return (
          <Card key={section.id} className="bg-[hsl(240,6%,10%)] border-[hsl(240,3.7%,15.9%)]">
            <CardContent className="p-4">
              <p className="text-[hsl(215,16%,47%)]">{section.content}</p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="px-4 py-6 space-y-6 max-w-4xl mx-auto">
      {/* Lesson Type Badge */}
      <div className="flex justify-center">
        <Badge 
          className={`${
            lesson.type === "hands-on" 
              ? "bg-[hsl(120,100%,50%)]/20 text-[hsl(120,100%,50%)] border-[hsl(120,100%,50%)]/30"
              : lesson.type === "lab"
                ? "bg-[hsl(14,100%,60%)]/20 text-[hsl(14,100%,60%)] border-[hsl(14,100%,60%)]/30"
                : "bg-[hsl(207,90%,54%)]/20 text-[hsl(207,90%,54%)] border-[hsl(207,90%,54%)]/30"
          }`}
        >
          {lesson.type.charAt(0).toUpperCase() + lesson.type.slice(1)} Lesson
        </Badge>
      </div>

      {/* Lesson Content */}
      <div className="space-y-6">
        {lesson.content.map(renderSection)}
      </div>

      {/* Lesson Footer */}
      <Card className="bg-gradient-to-r from-[hsl(227,39%,23%)] to-[hsl(240,6%,10%)] border-[hsl(120,100%,50%)]/20">
        <CardContent className="p-4 text-center">
          <p className="text-sm text-[hsl(215,16%,47%)] mb-2">
            🎯 Lesson completed! Ready to move on?
          </p>
          <p className="text-xs text-[hsl(215,16%,47%)]">
            Use the navigation below to continue your learning journey.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
