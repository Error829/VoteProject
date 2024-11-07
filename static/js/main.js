async function vote(candidateId) {
    try {
        const response = await fetch(`/vote/${candidateId}`, {
            method: 'POST'
        });
        const data = await response.json();

        if (data.success) {
            // 更新显示的票数
            document.getElementById(`votes-${candidateId}`).textContent = data.votes;
            alert('投票成功！');
        } else {
            alert('投票失败，请稍后重试。');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('投票失败，请稍后重试。');
    }
} 