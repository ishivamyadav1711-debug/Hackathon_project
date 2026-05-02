import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

export default function App() {
  const [power, setPower] = useState(0);
  const [history, setHistory] = useState([]);
  const [tip, setTip] = useState("");
  const [showModal, setShowModal] = useState(false);
  const avg =
    history.reduce((a, b) => a + b, 0) / (history.length || 1);

  const waste = Number((power - avg).toFixed(2));
  // ✅ 1. DATA FETCH
  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch("http://127.0.0.1:8000/data");
      const data = await res.json();

      setPower(data.value);
      setHistory(prev => [...prev.slice(-20), data.value]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);



  useEffect(() => {
    if (isNaN(waste)) return;

    const fetchTip = async () => {
      const res = await fetch(`http://127.0.0.1:8000/insight/${waste}`);
      const data = await res.json();
      setTip(data.tip);
    };

    fetchTip();
  }, [waste]);




  const cost = (power * 0.001 * 8).toFixed(2);

  const score = Math.max(0, 100 - Math.abs(waste));

  const chartData = {
    labels: history.map((_, i) => i),
    datasets: [
      {
        label: "Power (W)",
        data: history,
        borderColor: "#22d3ee",
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    plugins: {
      legend: { display: true }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Time (5 sec intervals)"
        }
      },
      y: {
        title: {
          display: true,
          text: "Power (Watts)"
        }
      }
    }
  };

  return (
    <div className="bg-black min-h-screen text-white p-6">

      <h1 className="text-3xl font-bold text-cyan-400 mb-6">
        ⚡ Smart Energy Dashboard
      </h1>

      {/* MAIN LAYOUT */}
      <div className="grid grid-cols-3 gap-6">

        {/* GRAPH */}
        <div className="col-span-2 bg-gray-900 p-4 rounded-xl shadow-lg">
          <Line data={chartData} options={chartOptions} />
        </div>

        {/* SIDE PANEL */}
        <div className="flex flex-col gap-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.03 }}
            className={`p-4 rounded-xl border ${waste > 20
              ? "bg-red-900 border-red-500"
              : waste > 5
                ? "bg-yellow-800 border-yellow-400"
                : "bg-green-900 border-green-400"
              }`}
          >
            <h3 className="text-cyan-400">💡 Smart Tip</h3>
            <p className="text-sm mt-1">{tip}</p>
          </motion.div>
          {/* Power */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-4 rounded-xl bg-blue-900"
          >
            <h3>Power</h3>
            <p className="text-xl">{power} W</p>
          </motion.div>

          {/* Waste */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            className={`p-4 rounded-xl ${waste > 0 ? "bg-red-700" : "bg-green-700"
              }`}
          >
            <h3>Waste</h3>
            <p className="text-xl">{waste.toFixed(2)} W</p>
          </motion.div>
          {/* Cost */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            className="p-4 rounded-xl bg-yellow-700"
          >
            <h3>Cost/hr</h3>
            <p className="text-xl">₹{cost}</p>
          </motion.div>

          {/* Efficiency */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            className="p-4 rounded-xl bg-purple-700"
          >
            <h3>Efficiency</h3>
            <p className="text-xl">{score.toFixed(0)}%</p>
          </motion.div>

          {/* Optimize */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            className="p-4 rounded-xl bg-gray-800"
          >
            <h3>Optimization</h3>

            <button
              className="mt-2 px-4 py-2 bg-cyan-500 rounded hover:bg-cyan-400"
              onClick={() => setShowModal(true)}
            >
              Optimize ⚡
            </button>
          </motion.div>


        </div>

      </div>

      <div className="bg-black min-h-screen text-white p-6">

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">

            <div className="bg-gray-900 p-6 rounded-xl w-96 shadow-lg border border-cyan-500">

              <h2 className="text-xl font-bold text-cyan-400 mb-4">
                ⚡ Optimization Plan
              </h2>

              <ul className="text-sm space-y-2">
                <li>• Shift heavy appliances to night</li>
                <li>• Turn off standby devices</li>
                <li>• Use smart scheduling</li>
              </ul>

              <div className="mt-4 p-3 bg-green-900 rounded">
                💰 Estimated Saving: ₹{(waste * 0.001 * 8).toFixed(2)}/hr
              </div>

              <button
                className="mt-4 w-full bg-red-500 py-2 rounded hover:bg-red-400"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>

            </div>
          </div>
        )}

      </div>
    </div>
         
  );
}