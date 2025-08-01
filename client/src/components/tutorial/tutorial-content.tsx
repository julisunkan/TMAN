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
          <Card key={section.id} className="bg-white border shadow-lg mx-4 mb-4">
            <CardContent className="p-6">
              {section.title && (
                <h3 className="text-xl font-bold mb-4 flex items-center space-x-2 text-gray-800">
                  <FileText className="w-6 h-6 text-blue-600" />
                  <span>{section.title}</span>
                </h3>
              )}
              <div className="prose prose-gray prose-lg max-w-none">
                {section.content.split('\n').map((paragraph, index) => {
                  if (paragraph.trim() === '') return null;
                  
                  // Handle bullet points
                  if (paragraph.trim().startsWith('•') || paragraph.trim().startsWith('-')) {
                    return (
                      <ul key={index} className="list-disc list-inside text-gray-700 mb-3">
                        <li>{paragraph.replace(/^[•-]\s*/, '')}</li>
                      </ul>
                    );
                  }
                  
                  // Handle numbered lists
                  if (/^\d+\./.test(paragraph.trim())) {
                    return (
                      <ol key={index} className="list-decimal list-inside text-gray-700 mb-3">
                        <li>{paragraph.replace(/^\d+\.\s*/, '')}</li>
                      </ol>
                    );
                  }
                  
                  return (
                    <p key={index} className="text-gray-700 mb-4 leading-relaxed text-base">
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
          <div key={section.id} className="mx-4 mb-4 space-y-2">
            {section.title && (
              <h4 className="text-lg font-bold text-blue-600">{section.title}</h4>
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
          <div key={section.id} className="mx-4 mb-4 space-y-2">
            {section.title && (
              <h4 className="text-lg font-bold text-green-600">{section.title}</h4>
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
          <div key={section.id} className="mx-4 mb-4">
            <Alert className="border-red-300 bg-red-50">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <AlertDescription>
                {section.title && (
                  <div className="font-bold text-red-700 mb-2">{section.title}</div>
                )}
                <div className="text-red-700">{section.content}</div>
              </AlertDescription>
            </Alert>
          </div>
        );

      case "info":
        return (
          <div key={section.id} className="mx-4 mb-4">
            <Alert className="border-blue-300 bg-blue-50">
              <Info className="w-4 h-4 text-blue-600" />
              <AlertDescription>
                {section.title && (
                  <div className="font-bold text-blue-700 mb-2">{section.title}</div>
                )}
                <div className="text-blue-700">{section.content}</div>
              </AlertDescription>
            </Alert>
          </div>
        );

      case "checklist":
        return (
          <Card key={section.id} className="bg-white border border-green-200 shadow-lg mx-4 mb-4">
            <CardContent className="p-6">
              {section.title && (
                <h3 className="text-xl font-bold mb-4 flex items-center space-x-2 text-gray-800">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <span>{section.title}</span>
                </h3>
              )}
              <div className="space-y-3">
                {section.content.split('\n').map((item, index) => {
                  if (item.trim() === '') return null;
                  const cleanItem = item.replace(/^[•-]\s*/, '');
                  return (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-5 h-5 mt-0.5 border-2 border-green-400 rounded-sm flex items-center justify-center bg-green-50">
                        <div className="w-2 h-2 bg-green-500 rounded-sm opacity-0 hover:opacity-100 transition-opacity cursor-pointer" />
                      </div>
                      <span className="text-gray-700 text-base">{cleanItem}</span>
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
