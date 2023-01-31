import time
import sys

sys.setrecursionlimit(5000)

class TEP():
    def __init__(self):
        """ ノードのつながりを辞書型で表現する """
        self.adjacency_dict = {}
    
    def add_vertex(self, v):
        """ ノードを追加する """
        self.adjacency_dict[v] = []
    def add_edge(self, v1, v2, color):
        """ ノード同士をつなぐ。"""
        self.adjacency_dict[v1].append([v2, color])
    def remove_edge(self, v1, v2, color):
        """ ノード同士のつながりを削除する。"""
        self.adjacency_dict[v1].remove([v2, color])
    def remove_vertex(self,v):
        """ ノードを削除する。"""
        while self.adjacency_dict[v] != []:
            adjacent_vertex = self.adjacency_dict[v][-1]
            self.remove_edge(v, adjacent_vertex)
        del self.adjacency_dict[v]
    
    def print_TEP(self):
        print(self.adjacency_dict)

def borderList(vertex, SorE):
    """各色の区間の区切りの近傍を出力
    Star : 時計回りに区間の最初の近傍リスト(昇順)
    End : 時計回りに区間の最後の近傍リスト(降順)"""
    startList = []
    endList = []
    for i in range(len(vertex)):
        if i+1 >= len(vertex):
            nextColorKey = 0
        else:
            nextColorKey = i+1

        prevColorKey = i-1
        
        if vertex[i][1] != vertex[nextColorKey][1]:
            endList.append(vertex[i])
        if vertex[i][1] != vertex[prevColorKey][1]:
            startList.append(vertex[i])
    
    startList.sort()
    endList.sort()

    if SorE == 'S':
        return startList
    else:
        return endList

def ccwBorderEdge(vertex, currentNeighbor):
    """反時計回りに色の切り替わる近傍を返す"""
    currentNum = vertex.index(currentNeighbor)
    for i in range(len(vertex)):
        if vertex[currentNum][1] != vertex[currentNum-1][1]:
            return vertex[currentNum-1]
        currentNum -= 1

def cwBorderEdge(vertex, currentNeighbor):
    """時計回りに色の切り替わる近傍を返す"""
    currentNum = -1 * (len(vertex) - vertex.index(currentNeighbor))
    for i in range(len(vertex)):
        if vertex[currentNum][1] != vertex[currentNum+1][1]:
            return vertex[currentNum+1]
        currentNum += 1

def serchMAXLeftA4C(T):
    """辞書式順序で最も大きいleft alternating 4-cycleを探索"""
    leftAlt4Cycle = []
    for n in range(5, len(T)):
        v1BorderList = borderList(T[n], 'S')
        for i in range(4):
            if v1BorderList[i][0] > n:
                #print(n, v1BorderList)
                #print(v1BorderList[i][0], T[v1BorderList[i][0]])
                v2Border = cwBorderEdge(T[v1BorderList[i][0]], [n, v1BorderList[i][1]])
                if v2Border[0] > n:
                    v3Border = cwBorderEdge(T[v2Border[0]], [v1BorderList[i][0], v2Border[1]])
                    if v3Border[0] > n and cwBorderEdge(T[v3Border[0]], [v2Border[0], v3Border[1]]) == [n, v2Border[1]]:
                        if leftAlt4Cycle == []:
                            leftAlt4Cycle = [n, v3Border[0], v2Border[0], v1BorderList[i][0]]
                        else:
                            if ((leftAlt4Cycle[0] < n) or (leftAlt4Cycle[0] == n and leftAlt4Cycle[1] < v3Border[0])
                             or (leftAlt4Cycle[0] == n and leftAlt4Cycle[1] == v3Border[0] and leftAlt4Cycle[2] < v2Border[0])
                             or (leftAlt4Cycle[0] == n and leftAlt4Cycle[1] == v3Border[0] and leftAlt4Cycle[2] == v2Border[0] and leftAlt4Cycle[3] < v1BorderList[i][0])):
                                leftAlt4Cycle = [n, v3Border[0], v2Border[0], v1BorderList[i][0]]

    return leftAlt4Cycle

def swichColor(T, v1, v2):
    """(v1, v2)の色をスイッチする"""
    for index, neighbor in enumerate(T[v1]):
        if v2 in neighbor:
            v2Ind = index
            break
    for index, neighbor in enumerate(T[v2]):
        if v1 in neighbor:
            v1Ind = index
            break

    if T[v1][v2Ind][1] == 'r':
        T[v1][v2Ind][1] = 'b'
        T[v2][v1Ind][1] = 'b'
    else:
        T[v1][v2Ind][1] = 'r'
        T[v2][v1Ind][1] = 'r'
    return T

def recFlip(T, Alt4Cycle, alreadySwichVertices):
    flipNeighbors = []
    curFlipVertex = alreadySwichVertices[-1]
    for i in range(len(T[curFlipVertex])):
        if T[curFlipVertex][i][0] not in alreadySwichVertices:
            swichColor(T, curFlipVertex, T[curFlipVertex][i][0])
            flipNeighbors.append(T[curFlipVertex][i][0])

    for j in range(len(flipNeighbors)):
        if flipNeighbors[j] not in Alt4Cycle and flipNeighbors[j] not in alreadySwichVertices:
            alreadySwichVertices.append(flipNeighbors[j])
            recFlip(T, Alt4Cycle, alreadySwichVertices)
    return T

def flip(T, Alt4Cycle):
    """right alternating 4-cycleをフリップする"""
    for index, neighbor in enumerate(T[Alt4Cycle[0]]):
        if Alt4Cycle[1] in neighbor:
            leftNeighbor = -1 * (len(T[Alt4Cycle[0]]) - index) + 1
            break

    if T[Alt4Cycle[0]][leftNeighbor][0] == Alt4Cycle[2]:
        swichColor(T, Alt4Cycle[0], Alt4Cycle[2])
    elif T[Alt4Cycle[0]][leftNeighbor][0] == Alt4Cycle[3]:      
        swichColor(T, Alt4Cycle[1], Alt4Cycle[3])
    else:
        alreadySwichVertices = [T[Alt4Cycle[0]][leftNeighbor][0]]
        recFlip(T, Alt4Cycle, alreadySwichVertices)

def findChildren(T, children):
    """Tの子を作成する"""
    for i in range(5,len(T)+1):
        v1BorderList = borderList(T[i], 'E')
        for j in range(4):
            if v1BorderList[j][0] > i:
                v2Border = ccwBorderEdge(T[v1BorderList[j][0]], [i, v1BorderList[j][1]])
                if v2Border[0] > i:
                    v3Border = ccwBorderEdge(T[v2Border[0]], [v1BorderList[j][0], v2Border[1]])
                    if v3Border[0] > i and ccwBorderEdge(T[v3Border[0]], [v2Border[0], v3Border[1]]) == [i, v2Border[1]]:
                        rightAlt4Cycle = [i, v1BorderList[j][0], v2Border[0], v3Border[0]]
                        flip(T, rightAlt4Cycle)
                        if serchMAXLeftA4C(T) == rightAlt4Cycle:

                            children = findChildren(T, children)
                            
                        flip(T, rightAlt4Cycle)
    return children

def makeMaximal(T):
    LA4C = serchMAXLeftA4C(T)
    if LA4C != []:
        flip(T, LA4C)
        makeMaximal(T)