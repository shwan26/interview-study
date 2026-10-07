// Pattern data, resource links and the inline SVG drawings.
export type Pat={id:string;name:string;h:number;days:string;hint:string};
export const PATS:Pat[]=[
 {id:'hash',name:'Hash map & set',h:190,days:'1, 3',hint:'You need to find a match, count something, or spot a duplicate. Trade memory for O(1) lookup instead of scanning again.'},
 {id:'twoptr',name:'Two pointers',h:150,days:'2',hint:'Sorted input, a pair or a palindrome. Start one pointer at each end and move the one that can improve the answer.'},
 {id:'window',name:'Sliding window',h:40,days:'8',hint:'Longest or best contiguous stretch. Grow the right edge, shrink the left edge when the rule breaks.'},
 {id:'stack',name:'Stack',h:15,days:'4',hint:'Most recent thing matters first: matching brackets, undo, nearest greater element.'},
 {id:'linked',name:'Linked list',h:290,days:'5',hint:'Rewire next pointers with prev, curr and next. Draw the arrows before coding. A dummy head removes edge cases.'},
 {id:'bsearch',name:'Binary search',h:215,days:'6',hint:'Sorted data, or a yes/no condition that flips once. Cut the search space in half every step.'},
 {id:'intervals',name:'Intervals',h:100,days:'9',hint:'Sort by start time, then walk through and merge or compare with the previous one.'},
 {id:'backtrack',name:'Backtracking',h:330,days:'10',hint:'Try every choice: choose, explore, undo. Draw the decision tree to see the base case.'},
 {id:'trees',name:'Trees (BFS / DFS)',h:130,days:'11, 12',hint:'BFS uses a queue and goes level by level. DFS uses recursion: solve the left, solve the right, combine.'},
 {id:'graph',name:'Graphs',h:260,days:'13',hint:'Grid or connections. Mark visited, then BFS or DFS from each unvisited node to count or copy components.'},
 {id:'heap',name:'Heap / top K',h:55,days:'15',hint:'Need the k biggest or smallest without sorting everything. Keep a heap of size k.'},
 {id:'dp',name:'Dynamic programming',h:320,days:'16, 17',hint:'Same subproblem again and again. Define dp[i], find the recurrence from earlier cells, then fill the table.'}
];
const VG='https://visualgo.net/en/',W3='https://www.w3schools.com/dsa/',HR='https://www.hackerrank.com/interview/interview-preparation-kit/';
export const RES:Record<string,string[][]>={
 hash:[['VisuAlgo','Hash table',VG+'hashtable'],['W3Schools','Hash tables',W3+'dsa_theory_hashtables.php'],['HackerRank','Dictionaries and hashmaps',HR+'dictionaries-hashmaps/challenges']],
 twoptr:[['VisuAlgo','Array',VG+'array'],['HackerRank','Arrays',HR+'arrays/challenges']],
 window:[['VisuAlgo','Array',VG+'array'],['HackerRank','String manipulation',HR+'strings/challenges']],
 stack:[['VisuAlgo','Stack and queue',VG+'list'],['W3Schools','Stacks',W3+'dsa_data_stacks.php'],['HackerRank','Stacks and queues',HR+'stacks-queues/challenges']],
 linked:[['VisuAlgo','Linked list',VG+'list'],['W3Schools','Linked lists',W3+'dsa_theory_linkedlists.php'],['HackerRank','Linked lists',HR+'linked-lists/challenges']],
 bsearch:[['VisuAlgo','Array',VG+'array'],['W3Schools','Binary search',W3+'dsa_algo_binarysearch.php'],['HackerRank','Search',HR+'search/challenges']],
 intervals:[['VisuAlgo','Sorting',VG+'sorting'],['W3Schools','Merge sort',W3+'dsa_algo_mergesort.php'],['HackerRank','Sorting',HR+'sorting/challenges']],
 backtrack:[['VisuAlgo','Recursion tree',VG+'recursion'],['HackerRank','Recursion and backtracking',HR+'recursion-backtracking/challenges']],
 trees:[['VisuAlgo','Binary search tree',VG+'bst'],['VisuAlgo','BFS and DFS',VG+'dfsbfs'],['W3Schools','Binary trees',W3+'dsa_data_binarytrees.php'],['HackerRank','Trees',HR+'trees/challenges']],
 graph:[['VisuAlgo','BFS and DFS',VG+'dfsbfs'],['W3Schools','Graph traversal',W3+'dsa_algo_graphs_traversal.php'],['HackerRank','Graphs',HR+'graphs/challenges']],
 heap:[['VisuAlgo','Binary heap',VG+'heap'],['HackerRank','Sorting',HR+'sorting/challenges']],
 dp:[['VisuAlgo','Recursion tree and DAG',VG+'recursion'],['HackerRank','Dynamic programming',HR+'dynamic-programming/challenges']],
 mock:[['HackerRank','Interview preparation kit','https://www.hackerrank.com/interview/interview-preparation-kit'],['HackerRank','Warm-up challenges',HR+'warmup/challenges']]
};

export const KIND:Record<string,string>={hash:'Hash map',twoptr:'Two pointers',window:'Sliding window',stack:'Stack',linked:'Linked list',bsearch:'Binary search',intervals:'Intervals',backtrack:'Backtracking',trees:'Trees',graph:'Graphs',heap:'Heap',dp:'DP',mock:'Mock round',oop:'OOP',sql:'SQL',sysdesign:'System design',cs:'CS Q&A',behav:'Behavioral',review:'Review'};
export const HUE:Record<string,number>=Object.fromEntries(PATS.map(p=>[p.id,p.h]));Object.assign(HUE,{mock:0,oop:200,sql:170,sysdesign:240,cs:20,behav:310,review:80});


function cells(vals:(number|string)[],x0:number,y:number,w:number,cls?:Record<number,string>){
  return vals.map((v,i)=>`<rect class="cell ${(cls&&cls[i])||''}" x="${x0+i*(w+2)}" y="${y}" width="${w}" height="34" rx="5"/><text class="t" x="${x0+i*(w+2)+w/2}" y="${y+22}">${v}</text>`).join('');
}
function mark(x:number,y:number,label:string,up?:boolean){
  return `<path class="acc" d="${up?`M${x} ${y} l-7 12 h14z`:`M${x} ${y} l-7 -12 h14z`}"/><text class="t" style="fill:var(--coral);font-weight:700" x="${x}" y="${up?y+26:y-16}">${label}</text>`;
}
export const SVG:Record<string,()=>string>={
 hash:()=>`<svg viewBox="0 0 320 120" role="img" aria-label="Array of numbers next to a lookup table">${cells([2,7,11,15],16,20,34)}<text class="tl" x="16" y="74">target 9: at 7, need 2</text><rect class="cell hi" x="196" y="14" width="108" height="86" rx="6"/><text class="tl" x="206" y="32" style="fill:var(--ink)">seen map</text><text class="t" style="text-anchor:start" x="206" y="54">2 → idx 0</text><text class="t" style="text-anchor:start" x="206" y="74">7 → idx 1</text><path class="accl" d="M168 37 H186"/><path class="acc" d="M192 37 l-9 -5 v10z"/></svg>`,
 twoptr:()=>`<svg viewBox="0 0 320 110">${cells([1,3,4,6,8,9,11,13],12,18,34,{0:'hi',5:'hi'})}${mark(29,58,'L',true)}${mark(209,58,'R',true)}<text class="tl" x="12" y="100">move L right or R left until they meet</text></svg>`,
 window:()=>`<svg viewBox="0 0 320 110">${cells([4,1,7,3,9,2,6,5],12,26,34,{2:'hi',3:'hi',4:'hi',5:'hi'})}<path class="ln" style="stroke:var(--coral)" d="M84 18 V12 H228 V18"/><text class="t" style="fill:var(--coral);font-weight:700" x="156" y="8">window</text>${mark(84,72,'left',true)}${mark(220,72,'right',true)}<path class="accl" d="M262 100 H296"/><path class="acc" d="M302 100 l-9 -5 v10z"/></svg>`,
 stack:()=>`<svg viewBox="0 0 320 130"><rect class="cell" x="30" y="86" width="90" height="30" rx="5"/><text class="t" x="75" y="106">(</text><rect class="cell" x="30" y="54" width="90" height="30" rx="5"/><text class="t" x="75" y="74">[</text><rect class="cell hi" x="30" y="22" width="90" height="30" rx="5"/><text class="t" x="75" y="42">{</text><path class="accl" d="M75 4 V18"/><path class="acc" d="M75 20 l-5 -9 h10z"/><text class="tl" x="140" y="42">push when opening</text><text class="tl" x="140" y="74">pop when closing</text><text class="tl" x="140" y="106">empty at end = valid</text></svg>`,
 linked:()=>`<svg viewBox="0 0 320 110">${[0,1,2,3].map(i=>`<rect class="cell ${i==1?'hi':''}" x="${14+i*76}" y="30" width="48" height="34" rx="5"/><text class="t" x="${38+i*76}" y="52">${i+1}</text>`).join('')}${[0,1,2].map(i=>`<path class="ln" d="M${62+i*76} 47 H${88+i*76}"/><path d="M${90+i*76} 47 l-8 -5 v10z" fill="var(--ink)"/>`).join('')}${mark(38,70,'prev',true)}${mark(114,70,'curr',true)}${mark(190,70,'next',true)}</svg>`,
 bsearch:()=>`<svg viewBox="0 0 320 110">${cells([1,3,5,7,9,11,13,15],12,18,34,{0:'dim',1:'dim',2:'dim',3:'hi'})}${mark(29,58,'lo',true)}${mark(121,58,'mid',true)}${mark(281,58,'hi',true)}<text class="tl" x="12" y="104">mid too small → throw away the left half</text></svg>`,
 intervals:()=>`<svg viewBox="0 0 320 120"><path class="ln" d="M12 100 H308"/>${([[20,100,22,'hi'],[80,130,46,''],[120,190,70,''],[250,300,22,'hi']] as [number,number,number,string][]).map(([a,b,y,c])=>`<rect class="cell ${c}" x="${a}" y="${y-14}" width="${b-a}" height="22" rx="5"/>`).join('')}<text class="tl" x="12" y="14">sort by start, then merge overlaps</text><rect class="cell tl2" style="fill:var(--teal);stroke:var(--ink)" x="80" y="82" width="110" height="10" rx="3"/><text class="tl" x="196" y="91">merged</text></svg>`,
 backtrack:()=>{const n=[[160,16],[90,56],[230,56],[55,98],[125,98],[195,98],[265,98]];const e=[[0,1],[0,2],[1,3],[1,4],[2,5],[2,6]];return `<svg viewBox="0 0 320 120">${e.map(([a,b])=>`<path class="ln" d="M${n[a][0]} ${n[a][1]} L${n[b][0]} ${n[b][1]}"/>`).join('')}${n.map(([x,y],i)=>`<circle class="node ${i==4?'hi':''}" cx="${x}" cy="${y}" r="11"/>`).join('')}<text class="tl" x="14" y="14">choose</text><text class="tl" x="14" y="28">explore</text><text class="tl" x="14" y="42">undo</text></svg>`},
 trees:()=>{const n=[[160,16,0],[100,52,1],[220,52,1],[70,92,2],[130,92,2],[190,92,2],[250,92,2]];const e=[[0,1],[0,2],[1,3],[1,4],[2,5],[2,6]];return `<svg viewBox="0 0 320 120">${e.map(([a,b])=>`<path class="ln" d="M${n[a][0]} ${n[a][1]} L${n[b][0]} ${n[b][1]}"/>`).join('')}${n.map(([x,y,l])=>`<circle class="node ${l==0?'hi':''}" cx="${x}" cy="${y}" r="12"/>`).join('')}<text class="tl" x="278" y="20">level 0</text><text class="tl" x="262" y="56">level 1</text><text class="tl" x="14" y="116">BFS: queue, level by level</text></svg>`},
 graph:()=>{const g=['11000','11000','00100','00011','00011'];let s='';g.forEach((r,y)=>[...r].forEach((c,x)=>{s+=`<rect class="cell ${c=='1'?'hi':''}" x="${20+x*34}" y="${8+y*20}" width="32" height="18" rx="3"/>`}));return `<svg viewBox="0 0 320 112">${s}<text class="tl" x="212" y="30">3 islands</text><text class="tl" x="212" y="50">visit a 1, flood</text><text class="tl" x="212" y="64">its neighbors,</text><text class="tl" x="212" y="78">count += 1</text></svg>`},
 heap:()=>{const n=[[160,18,1],[100,56,3],[220,56,2],[70,96,7],[130,96,5],[190,96,9],[250,96,4]];const e=[[0,1],[0,2],[1,3],[1,4],[2,5],[2,6]];return `<svg viewBox="0 0 320 120">${e.map(([a,b])=>`<path class="ln" d="M${n[a][0]} ${n[a][1]} L${n[b][0]} ${n[b][1]}"/>`).join('')}${n.map(([x,y,v],i)=>`<circle class="node ${i==0?'hi':''}" cx="${x}" cy="${y}" r="13"/><text class="t" x="${x}" y="${y+4}">${v}</text>`).join('')}<text class="tl" x="14" y="20">min-heap</text><text class="tl" x="14" y="34">top = smallest</text></svg>`},
 dp:()=>`<svg viewBox="0 0 320 110">${cells([1,1,2,3,5,8],16,40,42,{5:'hi'})}<path class="accl" d="M205 38 Q 183 8 163 38"/><path class="accl" d="M205 38 Q 225 8 247 38" style="stroke:var(--teal)"/><text class="tl" x="16" y="100">dp[i] = dp[i-1] + dp[i-2]</text><text class="tl" x="16" y="22">build the table from the smallest case</text></svg>`
};

