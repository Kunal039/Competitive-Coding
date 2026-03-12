class Solution {
public:
    int numSubarrayBoundedMax(vector<int>& nums, int left, int right) {
     
        int latest_invalid = -1;
        int latest_valid = -1;
        int count = 0;
        for (int i=0; i<nums.size(); i++) {

            if(nums[i]>right) {
                latest_invalid = i;
            }

            if(nums[i]>=left && nums[i]<=right) {
                latest_valid = i;
            }

            count += max(0, latest_valid - latest_invalid);
        }
        return count;
    }
};
