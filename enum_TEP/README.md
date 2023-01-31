# 研究で作ったプログラム
## 概要
入力 : transversal edge-partition<br>
出力 : 入力に対する全てのtransversal edge-partitionのリスト

グラフ理論におけるグラフを扱うプログラム。<br>
入力に対して存在するtransversal edge-partitionと呼ばれる辺の色分けを列挙する。

## 使い方
・Graphクラス<br>
  -adjacency_dict : 各頂点の近傍リストを入れておくもの(辞書型)<br>
  (近傍は[頂点番号, 辺の色('r'か'b')]で表される)
  
  -add_vertex(頂点番号) : 頂点の追加<br>
  -add_edge(頂点番号1, 頂点番号2, 辺の色) : 辺の追加
  
  -remove_vertex(頂点番号) : 頂点の削除<br>
  -remove_edge(頂点番号1, 頂点番号2, 辺の色) : 辺の削除
  
  -print_TEP() : adjacency_dictを出力
 
入力グラフのadjacency_dictができたら

`makeMaximal(Graph.adjacency_dict)`<br>
`findChildren(Graph.adjacency_dict, [])`

と入力することで列挙が開始される

※ findChildren関数の返り値がadjacency_dictからなるリスト
