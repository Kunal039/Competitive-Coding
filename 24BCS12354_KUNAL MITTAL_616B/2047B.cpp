#include <bits/stdc++.h>
using namespace std;

long long count_perm(const string &s) {
    int n = s.size();
    vector<int> f(26, 0);
    for (char c : s) f[c - 'a']++;
    long long res = 1;
    for (int i = 1; i <= n; i++) res *= i;
    for (int x : f) {
        long long d = 1;
        for (int i = 1; i <= x; i++) d *= i;
        res /= d;
    }
    return res;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int t;
    cin >> t;
    while (t--) {
        int n;
        cin >> n;
        string s;
        cin >> s;

        string ans = "";
        long long best = LLONG_MAX;

        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                string cur = s;
                cur[i] = s[j];
                long long v = count_perm(cur);
                if (v < best) {
                    best = v;
                    ans = cur;
                }
            }
        }

        cout << ans << '\n';
    }
    return 0;
}
