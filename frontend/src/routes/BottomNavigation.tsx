import { Text } from "@mantine/core";
import { Link } from "@tanstack/react-router";
import { ChartPie, HandCoins, Settings } from "lucide-react";

export function BottomNavigation() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-dark-card py-2">
      <div className="grid grid-cols-3 justify-around items-center text-text-muted">
        <Link to="/transactions">
          <div className="flex flex-col items-center">
            <HandCoins size={24} />
            <Text className="text-xs">Transactions</Text>
          </div>
        </Link>
        <Link to="/analytics">
          <div className="flex flex-col items-center">
            <ChartPie size={24} />
            <Text className="text-xs">Analytics</Text>
          </div>
        </Link>
        <Link to="/settings">
          <div className="flex flex-col items-center">
            <Settings size={24} />
            <Text className="text-xs">Settings</Text>
          </div>
        </Link>
      </div>
    </div>
  );
}
