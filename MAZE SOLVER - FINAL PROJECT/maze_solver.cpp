#include <iostream>
#include <vector>
#include <queue>
#include <map>
#include <set>
#include <algorithm>
using namespace std;

int dx[] = {1, -1, 0, 0};
int dy[] = {0, 0, 1, -1};

bool isValid(int x, int y, int n, int m, vector<vector<int>>& grid) {
    return (x >= 0 && y >= 0 && x < n && y < m && grid[x][y] == 0);
}

void printPath(map<pair<int,int>, pair<int,int>> parent, pair<int,int> start, pair<int,int> end) {
    vector<pair<int,int>> path;
    pair<int,int> curr = end;

    while (curr != start) {
        path.push_back(curr);
        curr = parent[curr];
    }
    path.push_back(start);

    reverse(path.begin(), path.end());

    cout << "\nShortest Path:\n";
    for (auto &p : path)
        cout << "(" << p.first << "," << p.second << ") ";
    cout << endl;
}

void bfs(vector<vector<int>>& grid, int n, int m, pair<int,int> start, pair<int,int> end) {
    queue<pair<int,int>> q;
    set<pair<int,int>> visited;
    map<pair<int,int>, pair<int,int>> parent;

    q.push(start);
    visited.insert(start);

    while (!q.empty()) {
        auto curr = q.front(); q.pop();

        if (curr == end) {
            cout << "\nPath Found using BFS!\n";
            printPath(parent, start, end);
            return;
        }

        for (int i = 0; i < 4; i++) {
            int nx = curr.first + dx[i];
            int ny = curr.second + dy[i];

            if (isValid(nx, ny, n, m, grid) && !visited.count({nx, ny})) {
                q.push({nx, ny});
                visited.insert({nx, ny});
                parent[{nx, ny}] = curr;
            }
        }
    }

    cout << "\nNo Path Found!\n";
}

int main() {
    int n, m;
    cout << "Enter number of rows and columns: ";
    cin >> n >> m;

    vector<vector<int>> grid(n, vector<int>(m));

    cout << "Enter maze (0 = path, 1 = wall):\n";
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            cin >> grid[i][j];
        }
    }

    pair<int,int> start, end;

    cout << "Enter start position (row col): ";
    cin >> start.first >> start.second;

    cout << "Enter end position (row col): ";
    cin >> end.first >> end.second;

    bfs(grid, n, m, start, end);

    return 0;
}