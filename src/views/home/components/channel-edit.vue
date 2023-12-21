<template>
  <div class="channel-edit">
    <van-cell :border="false">
      <div slot="title" class="title-text">我的频道</div>
      <van-button class="edit-btn" size="mini" round type="danger" plain
      @click="isEdit = !isEdit"
        >{{ isEdit ? '完成' : '编辑'}}</van-button
      >
    </van-cell>

    <van-grid class="my-grid" :gutter="10">
      <van-grid-item
        class="grid-item"
        v-for="(item, index) in myChannels"
        :key="item.id"
        @click="onMyChannelClick(item, index)"
      >
        <van-icon v-show="isEdit && !fiexdChannels.includes(item.id)" slot="icon" name="clear"></van-icon>
        <span
          :class="{ active: index === activeIndex }"
          class="text"
          slot="text"
          >{{ item.name }}</span
        >
      </van-grid-item>
    </van-grid>

    <van-cell :border="false">
      <div slot="title" class="title-text">频道推荐</div>
    </van-cell>

    <van-grid class="recomment-grid" :gutter="10">
      <van-grid-item
        icon="plus"
        class="grid-item"
        v-for="item in recommendChannels"
        :key="item.id"
        :text="item.name"
        @click="onAddChannel(item)"
      />
    </van-grid>
  </div>
</template>

<script>
import { getAllChannels, addUserChannel, deleteUserChannel } from '@/api/channel.js'
import { setItem } from '@/utils/storage.js'
export default {
  name: 'ChannelEdit',
  props: {
    myChannels: {
      type: Array,
      required: true
    },
    activeIndex: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      // 全部频道
      allChannels: [],
      // 记录编辑状态的变量
      isEdit: false,
      fiexdChannels: [0] // 不需要编辑、删除的频道
    }
  },
  created () {
    this.loadAllChannels()
  },
  methods: {
    async loadAllChannels () {
      const result = await getAllChannels()
      console.log(result)
      this.allChannels = result.data.data.channels
    },
    async onAddChannel (channel) {
      // 将频道数据添加到 我的频道 中
      this.myChannels.push(channel)

      // 区分是否有登录
      if (this.$store.state.user) {
        // 登录了，就要发送请求，将添加的频道保存到服务器
        try {
          await addUserChannel({
            id: channel.id,
            seq: this.myChannels.length
          })
          this.$toast.success('添加频道成功')
        } catch (err) {
          console.log(err)
          this.$toast.fail('添加频道成功')
        }
      } else {
        // 没有登录，就把当前的频道保存到 本地存储
        setItem('TOUTIAO_CHANNELS', this.myChannels)
      }
    },
    async onMyChannelClick (channel, index) {
      // 区分状态（编辑状态，非编辑状态）
      if (this.isEdit) {
        // 编辑状态，删除频道
        // 如果是不允许删除的频道，就return，不做后续删除处理
        if (this.fiexdChannels.includes(channel.id)) {
          return
        }

        // 如果要删除的频道的索引 小于 高亮频道索引，高亮频道索引 - 1
        if (index <= this.activeIndex) {
          this.$emit('update-active', this.activeIndex - 1, true)
        }
        // 根据索引，删除频道
        this.myChannels.splice(index, 1)

        // 根据用户是否登录，做删除频道的操作
        if (this.$store.state.user) {
          // 登录状态，发送请求，删除频道
          try {
            await deleteUserChannel(channel.id)
            this.$toast.success('删除频道成功')
          } catch (err) {
            console.log(err)
            this.$toast.fail('删除频道失败')
          }
        } else {
          // 没有登录，将频道数据保存到本地存储
          setItem('TOUTIAO_CHANNELS', this.myChannels)
        }
      } else {
        // 非编辑状态，切换频道
        // 子传父修改当前频道，关闭弹窗
        this.$emit('update-active', index, false)
      }
    }
  },
  // 推荐频道 = 所有频道 - 我的频道
  computed: {
    recommendChannels () {
      // 去循环所有频道，去找到跟我的频道不同的其他频道
      const result = []
      this.allChannels.forEach((item) => {
        // item变量就是遍历的每一个频道
        if (!this.myChannels.find((subItem) => subItem.id === item.id)) {
          // 如果不在我的频道里面，那么就应该是推荐频道
          result.push(item)
        }
      })
      return result
    }
  }
}
</script>

<style scoped lang="less">
.channel-edit {
  padding: 85px 0;

  .title-text {
    font-size: 32px;
    color: #333;
  }

  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }

  /deep/ .grid-item {
    width: 160px;
    height: 86px;
    .van-grid-item__content {
      white-space: nowrap;
      background-color: #f4f5f6;
      .van-grid-item__text,
      .text {
        font-size: 22px;
        color: #222;
        margin-top: 4px !important;
      }
      .active {
        color: red;
      }
    }
    .van-grid-item__icon-wrapper {
      position: unset;
    }
  }

  /deep/ .my-grid {
    .grid-item {
      .van-icon-clear,
      .clear {
        position: absolute;
        right: -10px;
        top: -10px;
        font-size: 30px;
        color: #cacaca;
        z-index: 2;
      }
    }
  }

  /deep/ .recomment-grid {
    .grid-item {
      width: 160px;
      height: 86px;
      .van-grid-item__content {
        flex-direction: row;

        .van-icon-plus {
          font-size: 22px;
          line-height: 22px;
          margin-right: 6px;
        }
      }
    }
  }
}
</style>
