import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const RAW_BASE =
  "https://raw.githubusercontent.com/okBhavya/portfolio/main/";

const ASSETS = [
  {
    file: "public/hero/desk-day.png",
    sha1: "55f13fec8cf992b9a2aa837d817eac5731db41ba",
  },
  {
    file: "public/hero/desk-night.png",
    sha1: "457dd7ae82f83cc435c2919db0c79d40efbfc71c",
  },
  {
    file: "public/projects/continual-rl/agent_demo.gif",
    sha1: "f9078716663be4d120708e563c0ebf2a53ef57e1",
  },
  {
    file: "public/projects/continual-rl/forgetting_vs_conflict.png",
    sha1: "bd2163f1052b2d7bda3bda8f51742fed72263ae3",
  },
  {
    file: "public/projects/continual-rl/stability_plasticity_pareto.png",
    sha1: "6038f7c7c7eb408874ac4989242ae66ae9e67a8e",
  },
  {
    file: "public/projects/customer-seg/banner_ranking_ndcg.png",
    sha1: "8f5ce59344119206e04a6e5f7c6e8a4a0ec79a5d",
  },
  {
    file: "public/projects/customer-seg/nba_policy_simulation.png",
    sha1: "487752e1904e76ed03f1c4a85c479512b1b89795",
  },
  {
    file: "public/projects/customer-seg/power_curve.png",
    sha1: "14823b5f6e8fbec81871f14c4181d7749c7b6b60",
  },
  {
    file: "public/projects/customer-seg/segment_outcomes.png",
    sha1: "64c57be98017fabde3764dfffb87acd5598ae56b",
  },
  {
    file: "public/projects/world-models/ablation_a_safety.png",
    sha1: "5ebf57134dccc6a105f63679251dbd5ac54bc15b",
  },
  {
    file: "public/projects/world-models/benchmark_comparison.png",
    sha1: "22349c586054e7271093881f33263f36d1f07a2f",
  },
  {
    file: "public/projects/world-models/demo.gif",
    sha1: "27f3b62cd198397cee73d34aa9e9974b25ad4020",
  },
  {
    file: "public/projects/world-models/prediction_error_growth.png",
    sha1: "de215f964b094f49740535eb06a49f47ae94d37d",
  },
];

function sha1Hex(buffer) {
  return crypto.createHash("sha1").update(buffer).digest("hex");
}

async function main() {
  for (const asset of ASSETS) {
    const dest = path.resolve(process.cwd(), asset.file);
    if (fs.existsSync(dest)) {
      const existing = fs.readFileSync(dest);
      if (sha1Hex(existing) === asset.sha1) {
        continue;
      }
    }

    fs.mkdirSync(path.dirname(dest), { recursive: true });
    const url = `${RAW_BASE}${asset.file}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch ${url}: HTTP ${res.status}`);
    }
    const buf = Buffer.from(await res.arrayBuffer());
    const actualSha = sha1Hex(buf);
    if (actualSha !== asset.sha1) {
      throw new Error(
        `SHA-1 mismatch for ${asset.file}: expected ${asset.sha1}, got ${actualSha}`
      );
    }
    fs.writeFileSync(dest, buf);
    console.log(`Synced ${asset.file} (${buf.length} bytes)`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
