// 清理重复的订阅记录,只保留最新的一条

const DIRECTUS_URL = 'http://localhost:8055';
const DIRECTUS_ADMIN_TOKEN = 'yOca6E-ANGzkfn9nst59vbR6GwuochDB';
const USER_ID = '24da5b63-cda3-424d-b98e-dfa32cb61278';

async function cleanupDuplicates() {
  console.log('🧹 Cleaning up duplicate subscription records...');
  console.log('');

  try {
    // 获取该用户的所有订阅记录
    const response = await fetch(
      `${DIRECTUS_URL}/items/user_subscriptions?filter[user_id][_eq]=${USER_ID}&sort=-id`,
      {
        headers: {
          Authorization: `Bearer ${DIRECTUS_ADMIN_TOKEN}`,
        },
      }
    );

    const data = await response.json();
    const subscriptions = data.data;

    console.log(`Found ${subscriptions.length} subscription records`);
    console.log('');

    if (subscriptions.length <= 1) {
      console.log('✅ No duplicates to clean up!');
      return;
    }

    // 保留第一条(最新的),删除其他的
    const toKeep = subscriptions[0];
    const toDelete = subscriptions.slice(1);

    console.log(`Keeping subscription ID: ${toKeep.id}`);
    console.log(`Deleting ${toDelete.length} duplicate records...`);
    console.log('');

    for (const sub of toDelete) {
      console.log(`  Deleting ID: ${sub.id}...`);
      const deleteResponse = await fetch(
        `${DIRECTUS_URL}/items/user_subscriptions/${sub.id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${DIRECTUS_ADMIN_TOKEN}`,
          },
        }
      );

      if (deleteResponse.ok) {
        console.log(`  ✅ Deleted ID: ${sub.id}`);
      } else {
        console.log(`  ❌ Failed to delete ID: ${sub.id}`);
      }
    }

    console.log('');
    console.log('═══════════════════════════════════════');
    console.log('🎉 Cleanup complete!');
    console.log('═══════════════════════════════════════');
    console.log('');
    console.log(`Final result: 1 subscription record for user ${USER_ID}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

cleanupDuplicates();
