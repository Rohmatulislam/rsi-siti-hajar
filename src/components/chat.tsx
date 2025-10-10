"use client";

import { useChat } from "ai/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { AlertCircle, Bot, User } from "lucide-react";

export default function Chat() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    error,
    isLoading: chatLoading,
  } = useChat({
    onError: (error) => {
      console.error("Chat error:", error);
    },
  });

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold mb-2">🤖 AI Chat</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Powered by OpenAI GPT-4o • Protected by Clerk Authentication
        </p>
      </div>

      {error && (
        <Card className="p-4 border-red-200 bg-red-50 dark:bg-red-900/20 mb-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span className="text-red-700 dark:text-red-300 text-sm">
              {error.message ||
                "An error occurred while processing your request."}
            </span>
          </div>
        </Card>
      )}

      <div className="space-y-4 mb-4 min-h-[400px] max-h-[600px] overflow-y-auto">
        {messages.length === 0 ? (
          <Card className="p-6 text-center border-dashed">
            <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
              Start a conversation
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Ask me anything! I&apos;m here to help with coding, questions, or
              just chat.
            </p>
          </Card>
        ) : (
          messages.map((m) => (
            <Card key={m.id} className="p-4">
              <div className="flex items-center gap-2 mb-2">
                {m.role === "user" ? (
                  <User className="w-4 h-4 text-blue-600" />
                ) : (
                  <Bot className="w-4 h-4 text-green-600" />
                )}
                <span className="font-semibold text-sm">
                  {m.role === "user" ? "You" : "AI Assistant"}
                </span>
              </div>
              <div className="whitespace-pre-wrap text-sm leading-relaxed pl-6">
                {m.content}
              </div>
            </Card>
          ))
        )}

        {chatLoading && (
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Bot className="w-4 h-4 text-green-600" />
              <span className="font-semibold text-sm">AI Assistant</span>
            </div>
            <div className="pl-6">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </Card>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex space-x-2">
        <Input
          value={input}
          placeholder="Type your message..."
          onChange={handleInputChange}
          className="flex-1"
          disabled={chatLoading}
        />
        <Button type="submit" disabled={chatLoading || !input.trim()}>
          {chatLoading ? "Sending..." : "Send"}
        </Button>
      </form>
    </div>
  );
}
