import { useState } from 'react';
import type { GameState } from '../types/game';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Network, AlertCircle, Unlink, Link2, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface ScreenProps {
  state: GameState;
  updateState: (updates: Partial<GameState>) => void;
  nextStep: () => void;
}

const TABLES = {
  customer: {
    name: 'Customer Table',
    columns: ['customer_id', 'age', 'gender', 'location'],
  },
  orders: {
    name: 'Orders Table',
    columns: ['order_id', 'customer_id', 'product_id', 'order_value'],
  },
  product: {
    name: 'Product Table',
    columns: ['product_id', 'product_name', 'category'],
  }
};

type Node = { table: string; column: string };
type Connection = { source: Node; target: Node; id: number };

export const Screen5DataModel = ({ state, updateState, nextStep }: ScreenProps) => {
  const isSubmitted = state.submittedSteps.includes(5);
  const [activeNode, setActiveNode] = useState<Node | null>(null);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', msg: string } | null>(
    isSubmitted ? { type: 'success', msg: 'Chính xác! Cấu trúc Data Model dạng Star Schema (1 Fact - 2 Dims) đã hoàn thành.' } : null
  );

  const handleNodeClick = (table: string, column: string) => {
    if (isSubmitted) return;
    // Check if the node is already connected
    const existingConn = connections.find(c => 
      (c.source.table === table && c.source.column === column) ||
      (c.target.table === table && c.target.column === column)
    );

    if (existingConn) {
      // Disconnect
      setConnections(prev => prev.filter(c => c.id !== existingConn.id));
      setFeedback(null);
      return;
    }

    if (!activeNode) {
      setActiveNode({ table, column });
      setFeedback(null);
    } else {
      // If clicking same table, swap active node
      if (activeNode.table === table) {
        setActiveNode({ table, column });
      } else {
        // Create connection
        const newConn: Connection = {
          id: Date.now(),
          source: activeNode,
          target: { table, column }
        };
        setConnections(prev => [...prev, newConn]);
        setActiveNode(null);
      }
    }
  };

  const getConnectionIndex = (table: string, column: string) => {
    return connections.findIndex(c => 
      (c.source.table === table && c.source.column === column) ||
      (c.target.table === table && c.target.column === column)
    );
  };

  const validateModel = () => {
    if (isSubmitted) return;
    
    let hasCustomerLink = false;
    let hasProductLink = false;
    let hasInvalidLinks = false;

    connections.forEach(c => {
      const nodes = [
        `${c.source.table}.${c.source.column}`,
        `${c.target.table}.${c.target.column}`
      ];

      const isCustomerLink = nodes.includes('orders.customer_id') && nodes.includes('customer.customer_id');
      const isProductLink = nodes.includes('orders.product_id') && nodes.includes('product.product_id');

      if (isCustomerLink) hasCustomerLink = true;
      else if (isProductLink) hasProductLink = true;
      else hasInvalidLinks = true;
    });

    const isPerfect = !hasInvalidLinks && hasCustomerLink && hasProductLink;
    const score = isPerfect ? 20 : 0;

    if (!isPerfect) {
      setFeedback({
        type: 'error',
        msg: 'Cấu trúc chưa chính xác! Đáp án đúng: Phải nối Orders(customer_id) với Customer(customer_id) và Orders(product_id) với Product(product_id).'
      });
    } else {
      setFeedback({
        type: 'success',
        msg: 'Chính xác! Cấu trúc Data Model dạng Star Schema (1 Fact - 2 Dims) đã hoàn thành.'
      });
    }

    updateState({
      score: { ...state.score, dataModel: score },
      selections: { ...state.selections, modelConnections: { connected: isPerfect ? 'true' : 'false' } },
      submittedSteps: [...state.submittedSteps, 5]
    });
  };

  const connectionColors = ['bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500'];

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="text-center mb-6">
        <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full mb-3 uppercase tracking-wider">
          Bước 4: Data Model
        </span>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Kết nối các bảng dữ liệu</h2>
        <p className="text-slate-600">
          Ôi không! Sau khi đưa vào Warehouse, các bảng đang bị rời rạc. <br/>
          Click vào <strong>tên cột</strong> của 2 bảng để tạo liên kết logic.
        </p>
      </div>

      {feedback && (
        <div className={cn(
          "mb-6 px-4 py-3 rounded-lg flex items-center justify-center gap-2 animate-in slide-in-from-top-2 duration-400",
          feedback.type === 'error' ? "bg-red-50 text-red-700 border border-red-200" : "bg-green-50 text-green-700 border border-green-200"
        )}>
          {feedback.type === 'error' ? <AlertCircle size={20} /> : <Network size={20} />}
          <span className="font-medium">{feedback.msg}</span>
        </div>
      )}

      {/* Tables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {(Object.keys(TABLES) as Array<keyof typeof TABLES>).map((tableKey) => {
          const table = TABLES[tableKey];
          return (
            <Card key={tableKey} className={cn("overflow-hidden shadow-md border-slate-200", isSubmitted && "opacity-90")}>
              <div className="bg-slate-800 text-white font-semibold py-3 px-4 flex items-center gap-2">
                <DatabaseIcon table={tableKey} />
                {table.name}
              </div>
              <div className="p-2">
                {table.columns.map(col => {
                  const connIdx = getConnectionIndex(tableKey, col);
                  const isConnected = connIdx !== -1;
                  const isActive = activeNode?.table === tableKey && activeNode?.column === col;
                  const colorClass = isConnected ? connectionColors[connIdx % connectionColors.length] : '';

                  return (
                    <div 
                      key={col}
                      onClick={() => handleNodeClick(tableKey, col)}
                      className={cn(
                        "flex justify-between items-center px-4 py-2 my-1 rounded cursor-pointer transition-all border",
                        isActive ? "bg-brand-50 border-brand-400 ring-1 ring-brand-400 shadow-sm" : 
                        isConnected ? "bg-slate-50 border-slate-200 font-semibold" : 
                        "border-transparent hover:bg-slate-100 text-slate-700",
                        isSubmitted && "cursor-default hover:bg-transparent"
                      )}
                    >
                      <span className={cn("font-mono text-sm", isConnected && "text-brand-700")}>
                        {col}
                      </span>
                      
                      {isConnected && (
                        <div className={cn("flex items-center gap-1 text-xs font-bold text-white px-2 py-0.5 rounded-full shadow-sm", colorClass)}>
                          <Link2 size={12} />
                          Nối {connIdx + 1}
                        </div>
                      )}

                      {isActive && !isSubmitted && !isConnected && (
                        <div className="w-2.5 h-2.5 bg-brand-500 rounded-full animate-ping" />
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-center flex-col items-center gap-4 border-t border-slate-100 pt-6">
        {!isSubmitted ? (
          <>
            <p className="text-sm text-slate-500">
              <Unlink size={16} className="inline mr-1" />
              Click lại vào một cột đã nối để huỷ kết nối
            </p>
            <Button onClick={validateModel} size="lg" className="px-10 gap-2">
              Nộp bài <ArrowRight size={20} />
            </Button>
          </>
        ) : (
          <Button onClick={nextStep} size="lg" className="px-10 gap-2 bg-green-600 hover:bg-green-700">
            Tiếp tục <ArrowRight size={20} />
          </Button>
        )}
      </div>
    </div>
  );
};

const DatabaseIcon = ({table}: {table: string}) => {
  if (table === 'customer') return <span className="text-yellow-400">👤</span>
  if (table === 'product') return <span className="text-green-400">📦</span>
  return <span className="text-blue-400">🧾</span> // orders
}
