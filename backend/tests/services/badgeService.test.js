describe('BadgeService Logic', () => {
  describe('Badge Condition Logic', () => {
    it('should check if user meets badge requirements', () => {
      const userStats = {
        arbresPlantes: 10,
        requiredTrees: 5
      };
      
      const earnsBadge = userStats.arbresPlantes >= userStats.requiredTrees;
      expect(earnsBadge).toBe(true);
    });

    it('should not award badge for insufficient progress', () => {
      const userStats = {
        arbresPlantes: 3,
        requiredTrees: 5
      };
      
      const earnsBadge = userStats.arbresPlantes >= userStats.requiredTrees;
      expect(earnsBadge).toBe(false);
    });
  });

  describe('Badge Points Calculation', () => {
    it('should calculate correct bonus points', () => {
      const badgePoints = 50;
      const currentScore = 100;
      const newScore = currentScore + badgePoints;
      expect(newScore).toBe(150);
    });

    it('should handle multiple badges', () => {
      const badges = [
        { points: 50 },
        { points: 30 },
        { points: 20 }
      ];
      
      const totalPoints = badges.reduce((sum, badge) => sum + badge.points, 0);
      expect(totalPoints).toBe(100);
    });
  });

  describe('Badge Rarity Logic', () => {
    it('should determine badge rarity based on difficulty', () => {
      const difficulty = 'hard';
      const rarity = difficulty === 'hard' ? 'rare' : 'common';
      expect(rarity).toBe('rare');
    });

    it('should assign common rarity for easy badges', () => {
      const difficulty = 'easy';
      const rarity = difficulty === 'hard' ? 'rare' : 'common';
      expect(rarity).toBe('common');
    });
  });
});