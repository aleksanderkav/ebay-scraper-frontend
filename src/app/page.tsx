"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Supabase config
const supabaseUrl = "https://srdidgpgywvrrjjvmnxce.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyZGlkZ3BneXd2cmpqdm1ueGNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5Mjk1MTEsImV4cCI6MjA2ODUwNTUxMX0.57mR6YOSZq1qI77d8Gu4HkLcKMMSKdoYLhNxQcKj88U";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

type ScrapedItem = {
  id: number;
  title: string;
  price: number;
  url: string;
};

export default function Home() {
  const [items, setItems] = useState<ScrapedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from("scraped_items")
        .select("id, title, price, url")
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) {
        console.error("Feil ved henting av data:", error.message);
      } else {
        setItems(data || []);
      }
      setLoading(false);
    }

    fetchData();
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Sist lagrede produkter</h1>
      {loading ? (
        <p>Laster inn...</p>
      ) : items.length > 0 ? (
        <ul className="space-y-4">
          {items.map((item) => (
            <li key={item.id} className="border p-4 rounded shadow">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {item.title}
              </a>
              <p className="text-gray-700">${item.price}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Ingen produkter funnet.</p>
      )}
    </main>
  );
}
